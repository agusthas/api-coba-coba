import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';

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
      const mockId = 'a uuid';
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockImplementation(async (input) =>
        Promise.resolve({
          id: mockId,
          ...input,
        }),
      );

      const result = await service.create(mockUser);

      expect(mockUserRepo.create).toBeCalledWith(mockUser);
      expect(mockUserRepo.save).toBeCalledWith(mockUser);

      expect(result).toEqual({
        id: mockId,
        ...mockUser,
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
  });
});
