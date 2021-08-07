import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';

import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUsersService = {
    getByUsername: jest.fn(),
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

      const result = await service.getAuthToken(user);

      expect(mockedJwtService.signAsync).toBeCalledWith(payload);

      expect(result).toMatchObject<AuthTokenDto>({
        access_token: 'signed-response',
      });
    });
  });
});
