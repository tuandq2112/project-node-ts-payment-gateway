import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  public email: string;
}

export class ChangePasswordDTO {
  @IsEmail()
  public email: string;
  @Length(6)
  public forgotPassCode: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  public newPassword: string;
}
