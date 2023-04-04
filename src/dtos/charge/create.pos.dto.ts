import { IsNotEmpty, IsUrl } from 'class-validator';

export class PosDTO {
  @IsNotEmpty()
  public marketHeader: string;

  @IsNotEmpty()
  public currencyType: string;

  @IsNotEmpty()
  public currency: string;

  @IsUrl()
  public logoUrl: string;
}
