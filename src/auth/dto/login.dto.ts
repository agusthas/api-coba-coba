import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  public readonly username!: string;

  @IsNotEmpty()
  @IsString()
  public readonly password!: string;
}
