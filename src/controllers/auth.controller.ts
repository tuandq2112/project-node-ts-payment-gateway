import { JwtInfo } from '@/dtos/jwtInfo.dto';
import { User } from '@/interfaces/users.interface';
import UserService from '@/services/users.service';
import AuthService from '@services/auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  public authService = new AuthService();
  public userService = new UserService();
  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: JwtInfo = req.body;
      const tokenData = this.authService.login(userData);
      const user: User = await this.userService.createUser({ address: userData.address });

      res.status(200).json({ data: { ...tokenData, ...user }, message: 'Login success' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
