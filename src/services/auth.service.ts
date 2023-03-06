import { JwtInfo } from '@/dtos/jwtInfo.dto';
import { validateSignature } from '@/utils/ethers.utils';
import { HttpException } from '@exceptions/HttpException';
import { TokenData } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import JwtService from './jwt.service';

class AuthService {
  public users = userModel;

  public login(jwtInfo: JwtInfo): TokenData {
    const isValidSignature = validateSignature(jwtInfo);
    if (!isValidSignature) {
      throw new HttpException(400, `Invalid Signature`);
    }

    const tokenData = JwtService.generateToken(jwtInfo);
    return tokenData;
  }
}

export default AuthService;
