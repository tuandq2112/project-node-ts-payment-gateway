import { UpdateUserDTO } from '@/dtos/update.user.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { NextFunction, Request, Response } from 'express';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserByAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address: string = req.params.address;
      const findOneUserData: User = await this.userService.findUserByAddress(address);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const address: string = req.user.address;
      const userData: UpdateUserDTO = req.body as UpdateUserDTO;

      const updateUserData: User = await this.userService.updateUser(address, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
