import { IsArray } from 'class-validator';

export class SetupCurrencyDTO {
  @IsArray()
  public currencies: string[];
}
