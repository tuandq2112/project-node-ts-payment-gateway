import { CurrentStatusEnum } from '@/enums/StatusEnum';
import { CurrentStepEnum } from '@/enums/StepEnum';
import { ApiKeyException } from '@/exceptions/ApiKeyException';
import { AuthException } from '@/exceptions/AuthExeception';
import ApiKeyModel from '@/models/apikey.model';
import UserModel from '@/models/user.model';
import userModel from '@/models/user.model';
import JwtService from '@/services/jwt.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Response } from 'express';

const authApiKeyMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const APIKEY = req.header('ipg-apikey') ? req.header('ipg-apikey') : null;
    console.log(req.path);

    if (APIKEY) {
        const foundApiKey = await ApiKeyModel.findOne({
            apikey: APIKEY,
            status: CurrentStatusEnum.ACTIVE
        });

        if (!foundApiKey) {
            next(ApiKeyException.doesNoteExist());
        }

        const foundUser = await UserModel.findOne({
            _id: foundApiKey.owner
        })
    
      if (foundUser) {
        req.user = foundUser;
        next();
      } else {
        next(AuthException.wrongAuthentication());
      }
    } else {
      next(ApiKeyException.apikeyMissing());
    }
  } catch (error) {
    next(ApiKeyException.wrongAuthentication());
  }
};

export default authApiKeyMiddleware;
