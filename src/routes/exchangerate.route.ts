import ExchangeRateController from '@/controllers/exchangerate.controller';
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

class ExchangeRateRoute implements Routes {
  public path = '/fiat-to-crypto';
  public router = Router();
  public exchangeRateController = new ExchangeRateController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    //public
    this.router.get(`${this.path}`, this.exchangeRateController.convert);

    //use auth
    // access with admin role
    // add validate ? /////
    this.router.post(`${this.path}`, this.exchangeRateController.setupTokenPrice);
  }
}

export default ExchangeRateRoute;
