import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/modules/users/users.service';

import { AuthTokenDto } from './dto/auth-token.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.usersService.getByUsername(username);

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async getAuthToken(user: UserDto): Promise<AuthTokenDto> {
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
