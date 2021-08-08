import { Expose } from 'class-transformer';

export class UserTokenClaimsDto {
  @Expose()
  public id!: string;

  @Expose()
  public username!: string;
}
