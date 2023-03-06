import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { Response } from 'express';

export class BaseResponseController {
  public response(res: Response, data: any, code = 200, message = 'success') {
    const responseData = new ResponseDTO(code, message, data);
    res.status(200).json(responseData);
  }
}
