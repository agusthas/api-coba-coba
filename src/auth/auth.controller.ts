import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { BaseResponse } from 'src/common/dto';

import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterInputDto } from './dto/register-input.dto';
import { UserTokenClaimsDto } from './dto/user-token-claims.dto';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public async login(
    @ReqUser() user: UserTokenClaimsDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credentials: LoginDto,
  ): Promise<BaseResponse<AuthTokenDto>> {
    const authToken = await this.authService.login(user);

    return {
      status: 'success',
      message: 'User successfully login.',
      data: authToken,
    };
  }
}
