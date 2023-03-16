import { CurrentStep } from '@/enums/LoginProcessEnum';
import { AuthException } from '@/exceptions/AuthExeception';
import userModel from '@/models/user.model';
import JwtService from '@/services/jwt.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Response } from 'express';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    console.log(req.path);

    if (Authorization) {
      const verificationResponse = JwtService.verifyToken(Authorization);
      console.log(verificationResponse);

      const currentStep = verificationResponse.currentStep;
      const account = verificationResponse.email;
      const verifyOpCode = verificationResponse.verifyOpCode;

      if (currentStep == CurrentStep.VERIFIED) {
        if (!verifyOpCode) {
          next(AuthException.twoFaNotWork());
        }
      }
      const findUser = await userModel.findOne({ account });

      if (findUser) {
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
