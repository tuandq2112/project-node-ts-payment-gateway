import { FRONT_END_URL } from '@/config';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { UserStatus } from '@/enums/UserStatus';
import { UserException } from '@/exceptions/UserException';
import { User } from '@/interfaces/user.interface';
import userModel from '@/models/user.model';
import { generateRandomString } from '@/utils/util';
import { hash } from 'bcrypt';
import EmailService from './email.service';

class UserService {
  public user = userModel;

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
    if (findUser.status != UserStatus.PENDING) {
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

  public async login(registerDTO: RegisterUserDTO): Promise<User> {
    const findUser = await this.user.findOne({ email: registerDTO.email });
    if (!findUser) {
      UserException.userNotFound();
    }
    const userPassword = findUser.password;
    const userStatus = findUser.status;

    const hashedPassword = await hash(registerDTO.password, 10);
    if (userPassword != hashedPassword) {
      UserException.passwordNotMatch();
    }
    if (userStatus == UserStatus.PENDING) {
      UserException.accountNotVerify();
    }

    if (userStatus == UserStatus.INACTIVE) {
      UserException.inactiveAccount();
    }
    const newUser = await this.user.create({ ...registerDTO, password: hashedPassword });
    return newUser;
  }

  private async sendVerifyEmail(account: string, randomString: string): Promise<boolean> {
    const findUser = await this.user.findOne({ email: account });
    if (!findUser) {
      UserException.userNotFound();
    }
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
    if (findUser.status != UserStatus.PENDING) {
      UserException.accountVerified();
    }
    const activeTime = new Date();
    if (activeCode == findUser.activeCode) {
      await this.user.updateOne({ _id: findUser._id }, { activeTime, status: UserStatus.ACTIVE });
      return true;
    } else {
      UserException.invalidActiveCode();
    }
  }
}
export default UserService;
