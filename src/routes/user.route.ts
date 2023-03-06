import UserController from '@/controllers/user.controller';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { ResendEmailDTO } from '@/dtos/user/resend.email.dto';
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
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterUserDTO, 'body'), this.userController.register);
    this.router.put(`${this.path}/resend`, validationMiddleware(ResendEmailDTO, 'query'), this.userController.resendVerifyEmail);
  }
}

export default UserRoute;
