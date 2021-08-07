import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/modules/users/users.service';

import { AuthTokenDto } from './dto/auth-token.dto';
import { UserTokenClaimsDto } from './dto/user-token-claims.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  private async getAuthToken(
    user: UserDto | UserTokenClaimsDto,
  ): Promise<AuthTokenDto> {
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
