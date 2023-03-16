import { DURATION, KEY_PAIR } from '@/config';
import { User } from '@/interfaces/user.interface';
import jsonwebtoken from 'jsonwebtoken';
const { PRIVATE_KEY, PUBLIC_KEY } = KEY_PAIR;
class JwtService {
  public static generateToken(user: any): string {
    const token = jsonwebtoken.sign(user, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: Number(DURATION) });
    return token;
  }

  public static verifyToken(token: string): User {
    return jsonwebtoken.verify(token, PUBLIC_KEY) as User;
  }
}
export default JwtService;
