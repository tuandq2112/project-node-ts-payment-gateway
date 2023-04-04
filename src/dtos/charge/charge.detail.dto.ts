import { Length, Matches } from 'class-validator';

export class ChargeDetailDTO {
  @Length(12)
  public code: string;
}
