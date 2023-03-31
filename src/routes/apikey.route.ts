import ApiKeyController from '@/controllers/apikey.controller';
import UserController from '@/controllers/user.controller';
import { Enable2FaDTO } from '@/dtos/user/2fa.code.dto';
import { ActiveUserDTO } from '@/dtos/user/active.user.dto';
import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { ResendEmailDTO } from '@/dtos/user/resend.email.dto';
import { SetupWalletDTO } from '@/dtos/user/setup.wallet.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
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
