import { CurrentStepEnum } from '@/enums/StepEnum';
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

      const account = verificationResponse.email;

      const findUser = await userModel.findOne({ email: account });

      if (findUser) {
        const verifyOpCode = findUser.verifyOpCode;
        const currentStep = findUser.currentStep;

        if (currentStep == CurrentStepEnum.SETUP_WALLET_COMPLETED) {
          if (!verifyOpCode) {
            next(AuthException.twoFaNotWork());
          }
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
