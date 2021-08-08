import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { UserTokenClaimsDto } from '../dto/user-token-claims.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger: Logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  public async validate(
    username: string,
    password: string,
  ): Promise<UserTokenClaimsDto> {
    this.logger.log(`${this.validate.name} was called`);
    const user = await this.authService.validate(username, password);

    return {
      id: user.id,
      username: user.username,
    };
  }
}
