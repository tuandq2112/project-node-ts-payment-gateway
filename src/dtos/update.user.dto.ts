import { Allow, IsEmail, IsUrl } from 'class-validator';

export class UpdateUserDTO {
  @Allow()
  public username: string;

  @Allow()
  public profileImage: string;

  @Allow()
  public biography: string;

  @IsEmail()
  public email: string;

  @IsUrl()
  public link: string;
}
