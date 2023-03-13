import { DURATION, KEY_PAIR } from '@/config';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
const { PRIVATE_KEY, PUBLIC_KEY } = KEY_PAIR;
class JwtService {
  public static generateToken(user: any): string {
    const token = jsonwebtoken.sign(user, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: Number(DURATION) });
    return token;
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
