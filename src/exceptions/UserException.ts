import { ResponseDTO } from '@/dtos/base/ResponseDTO';
import { HttpException } from './base/HttpException';

export class UserException extends HttpException {
  public static ERROR_CODE = 1000;

  public static userExisted() {
    const response = new ResponseDTO(this.ERROR_CODE + 1, 'UserService: user existed', null);

    throw new UserException(200, response);
  }

  public static userNotFound() {
    const response = new ResponseDTO(this.ERROR_CODE + 2, 'UserService: user not found', null);

    throw new UserException(200, response);
  }

  public static passwordNotMatch() {
    const response = new ResponseDTO(this.ERROR_CODE + 3, 'UserService: password not match', null);

    throw new UserException(200, response);
  }

  public static accountNotVerify() {
    const response = new ResponseDTO(this.ERROR_CODE + 4, 'UserService: account not verify', null);

    throw new UserException(200, response);
  }

  public static inactiveAccount() {
    const response = new ResponseDTO(this.ERROR_CODE + 5, 'UserService: account inactivated', null);

    throw new UserException(200, response);
  }

  public static sendVerifyEmailFail() {
    const response = new ResponseDTO(this.ERROR_CODE + 6, 'UserService: send verify email fail', null);

    throw new UserException(200, response);
  }

  public static resendEmailSoFast() {
    const response = new ResponseDTO(this.ERROR_CODE + 7, 'UserService: resend email so fast', null);

    throw new UserException(200, response);
  }

  public static accountVerified() {
    const response = new ResponseDTO(this.ERROR_CODE + 8, 'UserService: account verified', null);

    throw new UserException(200, response);
  }

  public static invalidActiveCode() {
    const response = new ResponseDTO(this.ERROR_CODE + 9, 'UserService: invalid active code', null);

    throw new UserException(200, response);
  }

  public static enabled2FA() {
    const response = new ResponseDTO(this.ERROR_CODE + 10, 'UserService: enabled two factor authentication', null);

    throw new UserException(200, response);
  }

  public static walletInstaller() {
    const response = new ResponseDTO(this.ERROR_CODE + 11, 'UserService: Wallet installer', null);

    throw new UserException(200, response);
  }
  public static blockchainError(message: string) {
    const response = new ResponseDTO(this.ERROR_CODE + 12, `UserService: Transaction fail with reason ${message}`, null);

    throw new UserException(200, response);
  }

  public static invalidOpcode() {
    const response = new ResponseDTO(this.ERROR_CODE + 13, `UserService: invalid opcode`, null);

    throw new UserException(200, response);
  }
}
