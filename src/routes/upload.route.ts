import UploadController from '@/controllers/upload.controller';
// import authMiddleware from '@/middlewares/auth.middleware';
import upload from '@/upload';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class UploadRoute implements Routes {
  public path = '/upload';
  public router = Router();
  public uploadController = new UploadController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/single`, upload.single('file'), this.uploadController.uploadSingle);
    this.router.post(`${this.path}/multiple`, upload.array('files'), this.uploadController.uploadMultiple);
  }
}

export default UploadRoute;
