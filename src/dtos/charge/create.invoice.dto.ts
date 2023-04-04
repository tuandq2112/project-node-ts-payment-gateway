import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInvoiceDTO {
  public name: string;
  public memo: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public currencyType: string;

  @IsNotEmpty()
  public currency: string;

  @IsNotEmpty()
  public amount: Number;
}
