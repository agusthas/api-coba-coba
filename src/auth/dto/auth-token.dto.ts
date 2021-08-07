import { Expose } from 'class-transformer';

export class AuthTokenDto {
  @Expose()
  public access_token!: string;
}
