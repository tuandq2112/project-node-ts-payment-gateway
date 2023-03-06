import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from '@/exceptions/base/HttpException';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const data: ResponseDTO = error.message;

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${error.message}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
