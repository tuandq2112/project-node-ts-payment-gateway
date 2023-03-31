import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from './base/HttpException';

export class ApiKeyException extends HttpException {
  public static ERROR_CODE = 1000;

  public static wrongAuthentication() {
    const response = new ResponseDTO(401, 'ApiKeyMiddleware: Wrong authentication with api key', null);
    return new ApiKeyException(401, response);
  }

  public static invalidOwner() {
    const response = new ResponseDTO(this.ERROR_CODE + 1, 'ApiKeyService: user is not the owner of ApiKey', null);

    throw new ApiKeyException(200, response);
  }

  public static doesNoteExist() {
    const response = new ResponseDTO(this.ERROR_CODE + 2, 'ApiKeyService: ApiKey does not exist', null);

    throw new ApiKeyException(200, response);
  }

  public static apikeyMissing() {
    const response = new ResponseDTO(this.ERROR_CODE + 3, 'ApiKeyService: You forgot "ipg-apikey" ', null);

    throw new ApiKeyException(200, response);
  }
}
