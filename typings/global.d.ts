import { UserTokenClaimsDto } from '../src/auth/dto/user-token-claims.dto';

export declare global {
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type Voidable<T> = T | void;

  namespace Express {
    interface Request {
      id: string;
    }

    // Add a User here
    interface User extends UserTokenClaimsDto {}
  }
}
