import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
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
}

export default UserController;