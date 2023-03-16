import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  public password: string;

  @IsOptional()
  public twofaCode: string;
}
