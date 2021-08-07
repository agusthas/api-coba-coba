import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public readonly name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  public readonly username!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  public readonly password!: string;
}
