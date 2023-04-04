import UserController from '@/controllers/user.controller';
import { Enable2FaDTO } from '@/dtos/user/2fa.code.dto';
import { ActiveUserDTO } from '@/dtos/user/active.user.dto';
import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { ResendEmailDTO } from '@/dtos/user/resend.email.dto';
import { SetupCurrencyDTO } from '@/dtos/user/setup.currency.dto';
import { SetupWalletDTO } from '@/dtos/user/setup.wallet.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    //public
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterUserDTO, 'body'), this.userController.register);
    this.router.put(`${this.path}/resend`, validationMiddleware(ResendEmailDTO, 'query'), this.userController.resendVerifyEmail);
    this.router.put(`${this.path}/active`, validationMiddleware(ActiveUserDTO, 'query'), this.userController.activeAccount);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDTO, 'body'), this.userController.login);

    //use auth
    this.router.get(`${this.path}/generate-qr`, authMiddleware, this.userController.generateQR);
    this.router.put(`${this.path}/enable-2fa`, authMiddleware, validationMiddleware(Enable2FaDTO, 'body'), this.userController.enable2Fa);
    this.router.put(`${this.path}/setup-wallet`, authMiddleware, validationMiddleware(SetupWalletDTO, 'body'), this.userController.setupWallet);
    this.router.put(`${this.path}/setup-currency`, authMiddleware, validationMiddleware(SetupCurrencyDTO, 'body'), this.userController.setupCurrency);
  }
}

export default UserRoute;
