import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/modules/users/users.service';

import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterInputDto } from './dto/register-input.dto';
import { UserTokenClaimsDto } from './dto/user-token-claims.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(input: LoginDto): Promise<AuthTokenDto> {
    const user = await this.validate(input.username, input.password);

    return this.getAuthToken(user);
  }

  public async register(input: RegisterInputDto): Promise<UserDto> {
    const user = await this.usersService.create(input);

    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async validate(
    username: string,
    password: string,
  ): Promise<UserTokenClaimsDto> {
    const user = await this.usersService.getByUsername(username);

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    return plainToClass(UserTokenClaimsDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async getAuthToken(user: UserTokenClaimsDto): Promise<AuthTokenDto> {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const authToken = {
      access_token: await this.jwtService.signAsync(payload),
    };

    return plainToClass(AuthTokenDto, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
