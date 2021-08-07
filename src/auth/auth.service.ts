import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/modules/users/users.service';

import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
