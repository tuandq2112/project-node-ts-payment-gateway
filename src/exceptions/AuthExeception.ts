import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from './base/HttpException';

export class AuthException extends HttpException {
  public static wrongAuthentication() {
    const response = new ResponseDTO(401, 'AuthMiddleware: Wrong authentication token', null);
    return new AuthException(401, response);
  }

  public static tokenMissing() {
    const response = new ResponseDTO(400, 'AuthMiddleware: Authentication token missing', null);
    return new AuthException(400, response);
  }

  public static userNotWorking() {
    const response = new ResponseDTO(401, 'AuthMiddleware: User not active', null);
    return new AuthException(401, response);
  }
}
