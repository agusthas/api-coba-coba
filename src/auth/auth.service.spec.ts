import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';

import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterInputDto } from './dto/register-input.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUsersService = {
    getByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockedJwtService = {
    signAsync: jest.fn(),
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
    const user = {
      id: 'a uuid',
      name: 'John Doe',
      username: 'johndoe',
      password: 'hashed',
    };
    let spy: jest.SpyInstance;

    beforeEach(() => {
      mockedUsersService.getByUsername.mockResolvedValue(user);
      spy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async () => Promise.resolve(true));
    });
    it('should validate user', async () => {
      await service.validate('johndoe', 'password');

      expect(mockedUsersService.getByUsername).toBeCalledWith('johndoe');
      expect(spy).toBeCalledTimes(1);
    });

    it('should return serialized user (no password)', async () => {
      const result = await service.validate('johndoe', 'password');

      expect(result).not.toHaveProperty('password');
    });

    it('should throw an error if given invalid credentials', async () => {
      mockedUsersService.getByUsername
        .mockRejectedValueOnce(new Error())
        .mockResolvedValueOnce(user);

      spy.mockImplementationOnce(() => null).mockRejectedValueOnce(false);

      await expect(service.validate('johndoe', 'password')).rejects.toThrow(
        Error,
      );
      await expect(service.validate('johndoe', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getAuthToken', () => {
    const user = {
      id: 'a uuid',
      username: 'johndoe',
      name: 'John Doe',
    };

    const payload = {
      sub: user.id,
      username: user.username,
    };

    it('should generate access token with payload', async () => {
      mockedJwtService.signAsync.mockResolvedValueOnce('signed-response');

      // https://stackoverflow.com/questions/48906484/how-to-unit-test-private-methods-in-typescript
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const result = await service['getAuthToken'](user);

      expect(mockedJwtService.signAsync).toBeCalledWith(payload);

      expect(result).toMatchObject<AuthTokenDto>({
        access_token: 'signed-response',
      });
    });
  });

  describe('login', () => {
    const user = {
      id: 'a uuid',
      username: 'johndoe',
    };

    const accessToken = {
      access_token: 'signed-response',
    };

    it('should return auth token for valid user', async () => {
      const validateSpy = jest
        .spyOn(service, 'validate')
        .mockResolvedValue(user);

      // https://www.jeffryhouser.com/index.cfm/2019/11/19/How-to-Spy-on-a-Private-Method-with-a-Jasmine
      const getAuthSpy = jest
        .spyOn<any, any>(service, 'getAuthToken')
        .mockResolvedValue(accessToken);

      const userInput: LoginDto = {
        username: 'johndoe',
        password: 'password',
      };

      const result = await service.login(userInput);

      expect(validateSpy).toBeCalledWith(
        userInput.username,
        userInput.password,
      );
      expect(getAuthSpy).toBeCalledWith(user);
      expect(result).toMatchObject(accessToken);
    });
  });

  describe('register', () => {
    const registerInput: RegisterInputDto = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
    };

    it('should register a new user', async () => {
      mockedUsersService.create.mockResolvedValue(registerInput);
      await service.register(registerInput);

      expect(mockedUsersService.create).toBeCalledTimes(1);
      expect(mockedUsersService.create).toBeCalledWith(registerInput);
    });

    it('should return serialized user', async () => {
      mockedUsersService.create.mockResolvedValue(registerInput);
      const result = await service.register(registerInput);

      expect(result).not.toHaveProperty('password');
    });
  });
});
