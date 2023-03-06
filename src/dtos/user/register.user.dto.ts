import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  public password: string;
}
