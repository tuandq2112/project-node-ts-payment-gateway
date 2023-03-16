import { FRONT_END_URL } from '@/config';
import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { CurrentStep } from '@/enums/LoginProcessEnum';
import { UserException } from '@/exceptions/UserException';
import { User } from '@/interfaces/user.interface';
import userModel from '@/models/user.model';
import { generateRandomString } from '@/utils/util';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './2fa.service';
import EmailService from './email.service';
import JwtService from './jwt.service';

class UserService {
  public user = userModel;
  public authenticationService = new TwoFactorAuthenticationService();
  public emailService = new EmailService();

  public async register(registerDTO: RegisterUserDTO): Promise<User> {
    const findUser = await this.user.findOne({ email: registerDTO.email });

    if (findUser) {
      UserException.userExisted();
    }
    const hashedPassword = await hash(registerDTO.password, 10);

    const randomString = generateRandomString(20);
    const sendResult = await this.sendVerifyEmail(registerDTO.email, randomString);
    if (sendResult) {
      const newUser = await this.user.create({
        ...registerDTO,
        password: hashedPassword,
        activeCode: randomString,
        lastTimeGenerateActiveCode: new Date(),
      });
      return newUser;
    } else {
      UserException.sendVerifyEmailFail();
    }
  }

  public async resendVerifyEmail(email: string): Promise<boolean> {
    const findUser = await this.user.findOne({ email });
    if (!findUser) {
      UserException.userNotFound();
    }
    if (findUser.currentStep != CurrentStep.REGISTERED) {
      UserException.accountVerified();
    }

    const now = Date.now();

    if (now <= new Date(findUser.lastTimeGenerateActiveCode).getTime() + 60 * 1000) {
      UserException.resendEmailSoFast();
    }
    const randomString = generateRandomString(20);
    const sendResult = await this.sendVerifyEmail(email, randomString);
    if (sendResult) {
      const updateData = { activeCode: randomString, lastTimeGenerateActiveCode: new Date() };
      await this.user.updateOne({ _id: findUser._id }, updateData);
      return true;
    } else {
      UserException.sendVerifyEmailFail();
    }
  }

  public async login(loginDTO: LoginUserDTO): Promise<any> {
    const findUser = await this.user.findOne({ email: loginDTO.email });
    if (!findUser) {
      UserException.userNotFound();
    }

    const userPassword = findUser.password;

    const isVerify = await compare(loginDTO.password, userPassword);

    if (!isVerify) {
      UserException.passwordNotMatch();
    }

    const jwtData = findUser.toJSON();

    const res = JwtService.generateToken(jwtData);

    const verifyOpCode = this.authenticationService.verifyTwoFactorAuthenticationCode(loginDTO.twofaCode, findUser.twoFactorAuthenticationCode);

    if (verifyOpCode) {
      await this.user.updateOne({ _id: findUser._id }, { verifyOpCode });
    }

    return { token: res, jwtData, verifyOpCode };
  }

  private async sendVerifyEmail(account: string, randomString: string): Promise<boolean> {
    const verifyUrl = `${FRONT_END_URL}?account=${account}&verifyCode=${randomString}`;
    return new Promise((resolve, reject) => {
      this.emailService
        .sendVerifyEmail(account, verifyUrl)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public async activeAccount(account: string, activeCode: string): Promise<boolean> {
    const findUser = await this.user.findOne({ email: account });
    if (!findUser) {
      UserException.userNotFound();
    }
    if (findUser.currentStep != CurrentStep.REGISTERED) {
      UserException.accountVerified();
    }
    const activeTime = new Date();
    const { otpauthUrl, base32 } = this.authenticationService.getTwoFactorAuthenticationCode(findUser.email);

    if (activeCode == findUser.activeCode) {
      await this.user.updateOne(
        { _id: findUser._id },
        { activeTime, currentStep: CurrentStep.EMAIL_VERIFIED, otpauthUrl, twoFactorAuthenticationCode: base32 },
      );
      return true;
    } else {
      UserException.invalidActiveCode();
    }
  }

  public getOptAuthUrl = async (account: string) => {
    const findUser = await this.user.findOne({ email: account });

    if (!findUser) {
      UserException.userNotFound();
      return;
    }

    return findUser.otpauthUrl;
  };

  public enableTwoFactorAuthentication = async (user: User): Promise<boolean> => {
    if (user?.security?.isEnable2Fa) {
      UserException.enabled2FA();
    }
    const oldSecurity = user?.security;
    const res = await this.user.updateOne(
      { _id: user._id },
      { currentStep: CurrentStep.SETUP_2FA_COMPLETED, security: { ...oldSecurity, isEnable2Fa: true } },
    );
    return res ? true : false;
  };

  public responseQRcode = async (otpauthUrl: string, response: Response) => {
    this.authenticationService.respondWithQRCode(otpauthUrl, response);
  };
}
export default UserService;
