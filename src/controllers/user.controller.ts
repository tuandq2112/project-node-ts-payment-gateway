import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { SetupWalletDTO } from '@/dtos/user/setup.wallet.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/user.interface';
import userService from '@/services/user.service';
import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';

class UserController extends BaseResponseController {
  public userService = new userService();
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: RegisterUserDTO = req.body;
      const newUser: User = await this.userService.register(body);
      const messageResponse = `Register account ${newUser.email} successfully!`;
      this.response(res, messageResponse);
    } catch (error) {
      next(error);
    }
  };

  public resendVerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = req.query.account ? req.query.account.toString() : '';
      const result: boolean = await this.userService.resendVerifyEmail(account);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public activeAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = req.query.account ? req.query.account.toString() : '';
      const activeCode = req.query.activeCode ? req.query.activeCode.toString() : '';
      const result: boolean = await this.userService.activeAccount(account, activeCode);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public generateQR = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const account = req.user.email;
      const otpauthUrl = await this.userService.getOptAuthUrl(account);
      this.userService.responseQRcode(otpauthUrl, res);
    } catch (error) {
      next(error);
    }
  };

  public enable2Fa = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.enableTwoFactorAuthentication(req.user);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: LoginUserDTO = req.body;
      const { token, verifyOpCode, jwtData } = await this.userService.login(body);
      const result = { token, merchant: jwtData, verifyOpCode };

      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public setupWallet = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const body: SetupWalletDTO = req.body;
      const result = await this.userService.setupWallet(body, req.user);
      this.response(res, result);
    } catch (error) {
      console.log(error);

      next(error);
    }
  };
}

export default UserController;
