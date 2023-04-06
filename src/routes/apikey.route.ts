import ApiKeyController from '@/controllers/apikey.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class ApiKeyRoute implements Routes {
  public path = '/apikey';
  public router = Router();
  public apiKeyController = new ApiKeyController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    //use auth
    this.router.get(`${this.path}/new`, authMiddleware, this.apiKeyController.newApikey);
    this.router.delete(`${this.path}/:apikey`, authMiddleware, this.apiKeyController.removeApikey);
  }
}

export default ApiKeyRoute;
