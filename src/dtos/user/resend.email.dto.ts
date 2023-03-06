import { IsEmail } from 'class-validator';

export class ResendEmailDTO {
  @IsEmail()
  public account: string;
}
