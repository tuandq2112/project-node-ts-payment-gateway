import { FRONT_END_URL } from '@/config';
import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { LoginProcessEnum } from '@/enums/LoginProcessEnum';
import { UserStatusEnum } from '@/enums/UserStatus';
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
    if (findUser.status != UserStatusEnum.PENDING) {
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
    const userStatus = findUser.status;

    const isVerify = await compare(loginDTO.password, userPassword);

    if (!isVerify) {
      UserException.passwordNotMatch();
    }
    if (userStatus == UserStatusEnum.PENDING) {
      UserException.accountNotVerify();
    }

    if (userStatus == UserStatusEnum.INACTIVE) {
      UserException.inactiveAccount();
    }
    let res = '';

    const verifyOpCode = this.authenticationService.verifyTwoFactorAuthenticationCode(loginDTO.twofaCode, findUser.twoFactorAuthenticationCode);

    if (verifyOpCode) {
      res = JwtService.generateToken({ email: findUser.email, status: findUser.status });
      await this.user.updateOne({ _id: findUser._id }, { loginProcess: LoginProcessEnum.LOGIN, security: { isEnable2Fa: true } });
    } else {
      await this.user.updateOne({ _id: findUser._id }, { loginProcess: LoginProcessEnum.WAIT });
    }

    return { token: res, object: findUser };
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
    if (findUser.status != UserStatusEnum.PENDING) {
      UserException.accountVerified();
    }
    const activeTime = new Date();
    if (activeCode == findUser.activeCode) {
      await this.user.updateOne({ _id: findUser._id }, { activeTime, status: UserStatusEnum.ACTIVE });
      return true;
    } else {
      UserException.invalidActiveCode();
    }
  }

  public generateTwoFactorAuthenticationCode = async (account: string) => {
    const findUser = await this.user.findOne({ email: account });

    if (!findUser) {
      UserException.userNotFound();
      return;
    }

    if (findUser?.security?.isEnable2Fa) {
      UserException.enabled2FA();
    }

    return this.authenticationService.getTwoFactorAuthenticationCode(findUser.email);
  };

  public updateSecretBase32 = async (account: string, base32: string) => {
    const findUser = await this.user.findOne({ email: account });

    return await this.user.findByIdAndUpdate(findUser._id, {
      twoFactorAuthenticationCode: base32,
    });
  };

  public responseQRcode = async (otpauthUrl: string, response: Response) => {
    this.authenticationService.respondWithQRCode(otpauthUrl, response);
  };
}
export default UserService;
