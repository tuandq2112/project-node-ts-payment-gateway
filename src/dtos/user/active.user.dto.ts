import { IsEmail, Length } from 'class-validator';

export class ActiveUserDTO {
  @IsEmail()
  public account: string;

  @Length(20)
  public activeCode: string;
}
