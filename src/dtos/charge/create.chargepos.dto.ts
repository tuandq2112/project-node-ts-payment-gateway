import { IsNotEmpty } from 'class-validator';

export class ChargePosDTO {
  @IsNotEmpty()
  public code: string;

  @IsNotEmpty()
  public amount: Number;
}
