import { UpdateUserDTO } from '@/dtos/update.user.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import UsersController from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:address`, authMiddleware, this.usersController.getUserByAddress);
    this.router.put(`${this.path}`, authMiddleware, validationMiddleware(UpdateUserDTO, 'body', true), this.usersController.updateUser);
  }
}

export default UsersRoute;
