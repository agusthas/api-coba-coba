import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterInputDto } from './dto/register-input.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerLocal', () => {
    const registerInput: RegisterInputDto = {
      username: 'johndoe',
      password: 'password',
      name: 'John Doe',
    };

    beforeEach(() => {
      mockAuthService.register.mockImplementation(async (input) =>
        Promise.resolve({
          id: 'a uuid',
          username: input.username,
          name: input.name,
        }),
      );
    });

    it('should call authService register method', async () => {
      await controller.registerLocal(registerInput);
      expect(mockAuthService.register).toBeCalledWith(registerInput);
    });

    it('should return base response of success', async () => {
      const result = await controller.registerLocal(registerInput);

      const response = {
        status: 'success',
        message: expect.any(String),
        data: expect.objectContaining({
          user: {
            id: 'a uuid',
            username: registerInput.username,
            name: registerInput.name,
          },
        }),
      };

      expect(result).toMatchObject(response);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const requestUser = {
        id: 'a uuid',
        username: 'johndoe',
      };

      const loginInput = {
        username: 'johndoe',
        password: 'password',
      };

      const result = await controller.login(requestUser, loginInput);

      expect(result).toEqual({
        status: 'success',
        message: expect.any(String),
        data: null,
      });
    });
  });
});
