import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { SetupWalletDTO } from '@/dtos/user/setup.wallet.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/user.interface';
import userService from '@/services/user.service';
import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';
import ApiKeyService from '@/services/apikey.service';

class ApiKeyController extends BaseResponseController {
  public apiKeyService = new ApiKeyService();

  public newApikey = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const result = await this.apiKeyService.newApikey(req.user);
      this.response(res, {apikey: result});
    } catch (error) {
      next(error);
    }
  };
  
  public removeApikey = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const result = await this.apiKeyService.removeApikey(req.user, req.params.apikey);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export default ApiKeyController;
