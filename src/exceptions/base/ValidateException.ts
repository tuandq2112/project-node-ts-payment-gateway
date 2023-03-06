import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from './HttpException';

export class ValidateException extends HttpException {
  public static ERROR_CODE = 200;

  public static invalidInput(message: string) {
    const response = new ResponseDTO(this.ERROR_CODE + 1, message, null);
    return new ValidateException(400, response);
  }
}
