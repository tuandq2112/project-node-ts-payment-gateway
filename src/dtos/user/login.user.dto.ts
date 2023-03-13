import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  public password: string;

  @Length(6)
  public twofaCode: string;
}
