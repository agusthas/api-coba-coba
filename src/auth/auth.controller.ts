import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponse } from 'src/common/dto';

import { AuthService } from './auth.service';
import { RegisterInputDto } from './dto/register-input.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async registerLocal(
    @Body() input: RegisterInputDto,
  ): Promise<BaseResponse<{ user: UserDto }>> {
    const newUser = await this.authService.register(input);

    return {
      status: 'success',
      message: 'User successfully registered.',
      data: {
        user: newUser,
      },
    };
  }

  // TODO: Add Login Method
  // TODO: Create guards
  // TODO: Param Decorators
}
