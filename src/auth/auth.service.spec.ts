import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';

import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RegisterInputDto } from './dto/register-input.dto';
import { UserTokenClaimsDto } from './dto/user-token-claims.dto';

const userFromEntity = {
  id: 'a uuid',
  username: 'johndoe',
  name: 'John Doe',
  password: 'password',
};

describe('AuthService', () => {
  let service: AuthService;

  const mockedUsersService = {
    getByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockedJwtService = {
    signAsync: jest.fn(),
  };

  const userTokenClaims: UserTokenClaimsDto = {
    id: 'a uuid',
    username: 'johndoe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    let compareSpy: jest.SpyInstance;

    beforeEach(() => {
      mockedUsersService.getByUsername.mockResolvedValue(userFromEntity);
      compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async () => Promise.resolve(true));
    });

    it('should validate user', async () => {
      await service.validate('johndoe', 'password');

      expect(mockedUsersService.getByUsername).toBeCalledWith('johndoe');
      expect(compareSpy).toBeCalledTimes(1);
    });

    it('should return serialized user (no password)', async () => {
      const result = await service.validate('johndoe', 'password');

      expect(result).not.toHaveProperty('password');
    });

    it('should throw an error if given invalid credentials', async () => {
      mockedUsersService.getByUsername
        .mockRejectedValueOnce(new Error())
        .mockResolvedValueOnce(userFromEntity);

      compareSpy
        .mockImplementationOnce(() => null)
        .mockRejectedValueOnce(false);

      await expect(service.validate('johndoe', 'password')).rejects.toThrow(
        Error,
      );
      await expect(service.validate('johndoe', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getAuthToken', () => {
    const payload = {
      sub: userTokenClaims.id,
      username: userTokenClaims.username,
    };

    it('should generate access token with payload', async () => {
      mockedJwtService.signAsync.mockResolvedValueOnce('signed-response');

      // https://stackoverflow.com/questions/48906484/how-to-unit-test-private-methods-in-typescript
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const result = await service['getAuthToken'](userTokenClaims);

      expect(mockedJwtService.signAsync).toBeCalledWith(payload);

      expect(result).toMatchObject<AuthTokenDto>({
        access_token: 'signed-response',
      });
    });
  });

  describe('login', () => {
    const accessToken = {
      access_token: 'signed-response',
    };

    it('should return auth token for valid user', async () => {
      // https://www.jeffryhouser.com/index.cfm/2019/11/19/How-to-Spy-on-a-Private-Method-with-a-Jasmine
      const getAuthSpy = jest
        .spyOn<any, any>(service, 'getAuthToken')
        .mockResolvedValue(accessToken);

      const result = await service.login(userTokenClaims);

      expect(getAuthSpy).toBeCalledWith(userTokenClaims);
      expect(result).toMatchObject(accessToken);
    });
  });

  describe('register', () => {
    const registerInput: RegisterInputDto = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
    };

    beforeEach(() => {
      mockedUsersService.create.mockResolvedValue(registerInput);
    });

    it('should register a new user', async () => {
      await service.register(registerInput);

      expect(mockedUsersService.create).toBeCalledTimes(1);
      expect(mockedUsersService.create).toBeCalledWith(registerInput);
    });

    it('should return serialized user', async () => {
      const result = await service.register(registerInput);

      expect(result).not.toHaveProperty('password');
    });
  });
});
