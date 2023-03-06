import { DURATION, KEY_PAIR } from '@/config';
import { JwtInfo } from '@/dtos/jwtInfo.dto';
import { TokenData } from '@/interfaces/auth.interface';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
const { PRIVATE_KEY, PUBLIC_KEY } = KEY_PAIR;
class JwtService {
  public static generateToken(tokenInfo: JwtInfo): TokenData {
    const token = jsonwebtoken.sign({ address: tokenInfo.address }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: Number(DURATION) });
    return { token, expiresIn: Number(DURATION) };
  }

  public static verifyToken(token: string): JwtPayload {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, PUBLIC_KEY, function (err, decoded) {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
export default JwtService;
