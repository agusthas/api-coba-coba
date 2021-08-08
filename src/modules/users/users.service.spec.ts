import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, QueryFailedError } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    name: 'John Doe',
    username: 'johndoe',
    password: 'password',
  };

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => Promise.resolve('hashed-password'));

      mockUserRepo.create.mockReturnValue(mockUser);

      mockUserRepo.save.mockImplementation(async (input) =>
        Promise.resolve({
          ...input,
          id: 'a uuid',
          password: 'hashed-password',
        }),
      );

      const result = await service.create(mockUser);

      expect(mockUserRepo.create).toBeCalledWith(mockUser);
      expect(mockUserRepo.save).toBeCalledWith(mockUser);

      expect(result).toEqual({
        ...mockUser,
        id: 'a uuid',
        password: 'hashed-password',
      });
    });

    it('should throw a bad request exception if duplicate username', async () => {
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockRejectedValue(
        new QueryFailedError('query', [], {}),
      );

      await expect(service.create(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a internal exception if general error', async () => {
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockRejectedValue(new Error());

      await expect(service.create(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getByUsername', () => {
    it('should get a user by username', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.getByUsername(mockUser.username);

      expect(mockUserRepo.findOne).toBeCalledWith<[FindOneOptions]>({
        where: { username: mockUser.username },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.getByUsername(mockUser.username)).rejects.toThrow();

      expect(mockUserRepo.findOne).toBeCalledWith<[FindOneOptions]>({
        where: { username: mockUser.username },
      });
    });
  });
});
