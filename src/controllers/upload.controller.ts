import { FileException } from '@/exceptions/base/FileException';
import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';

class UploadController extends BaseResponseController {
  public uploadMultiple = (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files;
      if (!files) {
        FileException.filesNotFound();
      }
      this.response(res, files);
    } catch (error) {
      next(error);
    }
  };

  public uploadSingle = (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        FileException.fileNotFound();
      }
      this.response(res, file);
    } catch (error) {
      next(error);
    }
  };
}

export default UploadController;
