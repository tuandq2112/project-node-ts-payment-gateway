import { UserStatusEnum } from '@/enums/UserStatus';
import { AuthException } from '@/exceptions/AuthExeception';
import userModel from '@/models/user.model';
import JwtService from '@/services/jwt.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Response } from 'express';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const verificationResponse = JwtService.verifyToken(Authorization);

      const account = verificationResponse.account;
      const findUser = await userModel.findOne({ account });

      if (findUser) {
        if (findUser.status != UserStatusEnum.ACTIVE) {
          next(AuthException.userNotWorking());
        }
        req.user = findUser;
        next();
      } else {
        next(AuthException.wrongAuthentication());
      }
    } else {
      next(AuthException.tokenMissing());
    }
  } catch (error) {
    next(AuthException.wrongAuthentication());
  }
};

export default authMiddleware;
