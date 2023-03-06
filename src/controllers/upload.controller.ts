import { HttpException } from '@/exceptions/HttpException';
import { Request, Response } from 'express';

class UploadController {
  public uploadMultiple = (req: Request, res: Response) => {
    const files = req.files;
    if (!files) {
      throw new HttpException(400, 'Not found files');
    }
    res.status(200).json({ data: files, message: 'Upload multiple file' });
  };

  public uploadSingle = (req: Request, res: Response) => {
    const file = req.file;
    console.log(file);

    if (!file) {
      throw new HttpException(400, 'Not found file');
    }
    res.status(200).json({ data: file, message: 'Upload single file' });
  };
}

export default UploadController;
