import { TWO_FACTOR_AUTHENTICATION_APP_NAME } from '@/config';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';

export class TwoFactorAuthenticationService {
  public getTwoFactorAuthenticationCode(email: string) {
    const secretCode = speakeasy.generateSecret({
      name: `${TWO_FACTOR_AUTHENTICATION_APP_NAME} (${email})`,
    });
    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }
  public respondWithQRCode(data: string, response: Response) {
    QRCode.toFileStream(response, data);
  }
  public verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode: string, secretBase32: string) {
    return speakeasy.totp.verify({
      secret: secretBase32,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
      window: 2,
    });
  }
}
