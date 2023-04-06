import { IsInt, Min } from 'class-validator';

export class PagingDTO {
  // @IsInt()
  // @Min(1)
  public page: Number;
  // @IsInt()
  // @Min(1)
  public limit: Number;
}
