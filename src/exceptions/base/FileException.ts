import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from './HttpException';

export class FileException extends HttpException {
  public static ERROR_CODE = 100;

  public static fileNotFound() {
    const response = new ResponseDTO(400, 'FileController: file not found', null);
    throw new FileException(this.ERROR_CODE, response);
  }

  public static filesNotFound() {
    const response = new ResponseDTO(400, 'FileController: files not found', null);
    throw new FileException(this.ERROR_CODE, response);
  }
}
