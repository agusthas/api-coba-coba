import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Logger } from 'src/common/services';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { UserTokenClaimsDto } from '../dto/user-token-claims.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly logger: Logger,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
    this.logger.setContext(LocalStrategy.name);
  }

  public async validate({
    username,
    password,
  }: LoginDto): Promise<UserTokenClaimsDto> {
    this.logger.log(`${this.validate.name} was called!`);
    const user = await this.authService.validate(username, password);

    return user;
  }
}
