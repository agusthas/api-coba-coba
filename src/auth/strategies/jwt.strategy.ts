import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Payload } from '../dto/payload.dto';
import { UserTokenClaimsDto } from '../dto/user-token-claims.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secretKey'),
    });
  }

  public validate({ sub, username }: Payload): UserTokenClaimsDto {
    if (!sub || !username) {
      throw new InternalServerErrorException(`Failed validate JwtStrategy`);
    }

    return { id: sub, username };
  }
}
