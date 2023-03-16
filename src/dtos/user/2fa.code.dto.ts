import { Length } from 'class-validator';

export class Enable2FaDTO {
  @Length(6)
  public authCode: string;
}
