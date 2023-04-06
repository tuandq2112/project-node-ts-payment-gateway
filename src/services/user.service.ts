import MerChantFactoryJson from '@/builder/MerchantFactory.json';
import { DEFAULT_CURRENCIES, FACTORY_ADDRESS, FRONT_END_URL, OPERATOR_PRIVATE_KEY, RPC_URL } from '@/config';
import { Enable2FaDTO } from '@/dtos/user/2fa.code.dto';
import { ChangePasswordDTO } from '@/dtos/user/forgot.pass.dto';
import { LoginUserDTO } from '@/dtos/user/login.user.dto';
import { RegisterUserDTO } from '@/dtos/user/register.user.dto';
import { SetupCurrencyDTO } from '@/dtos/user/setup.currency.dto';
import { SetupWalletDTO } from '@/dtos/user/setup.wallet.dto';
import { WalletDTO } from '@/dtos/user/wallet.dto';
import { CurrentStepEnum } from '@/enums/StepEnum';
import { UserException } from '@/exceptions/UserException';
import { User } from '@/interfaces/user.interface';
import CryptoPriceModel from '@/models/cryptoPrice.model';
import { default as UserModel, default as userModel } from '@/models/user.model';
import { generateRandomString } from '@/utils/util';
import { compare, hash } from 'bcrypt';
import { ethers } from 'ethers';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './2fa.service';
import EmailService from './email.service';
import JwtService from './jwt.service';
class UserService {
  public user = userModel;
  public authenticationService = new TwoFactorAuthenticationService();
  public emailService = new EmailService();
  public defaultCurrencies = [];

  constructor() {
    this.init();
  }

  public init = async () => {
    const currencies = DEFAULT_CURRENCIES.split(',');
    const token_price_arr = await CryptoPriceModel.find({ symbol: { $in: currencies } }, { _id: 1 });
    const currency_arr = [];
    for (const currency of token_price_arr) {
      currency_arr.push(currency._id);
    }

    this.defaultCurrencies = currency_arr;
    return;
  };

  public async register(registerDTO: RegisterUserDTO): Promise<User> {
    const findUser = await this.user.findOne({ email: registerDTO.email });

    if (findUser) {
      UserException.userExisted();
    }
    const hashedPassword = await hash(registerDTO.password, 10);

    const randomString = generateRandomString(20);

    const newUser = await this.user.create({
      ...registerDTO,
      password: hashedPassword,
      activeCode: randomString,
      lastTimeGenerateActiveCode: new Date(),
      blockchainData: { currencies: this.defaultCurrencies },
    });
    this.sendVerifyEmail(registerDTO.email, randomString);
    return newUser;
  }

  public async resendVerifyEmail(email: string): Promise<boolean> {
    const findUser = await this.user.findOne({ email });
    if (!findUser) {
      UserException.userNotFound();
    }
    if (findUser.currentStep != CurrentStepEnum.REGISTERED) {
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

    const ignoreFields = ['activeCode', '__v', 'password', 'twoFactorAuthenticationCode', 'otpauthUrl'];
    const jwtData = findUser.toJSON();
    for (const i of ignoreFields) {
      delete jwtData[i];
    }
    const res = JwtService.generateToken(jwtData);

    const verifyOpCode = this.authenticationService.verifyTwoFactorAuthenticationCode(loginDTO.twofaCode, findUser.twoFactorAuthenticationCode);

    if (verifyOpCode) {
      await this.user.updateOne({ _id: findUser._id }, { verifyOpCode });
    }
    console.log(findUser);

    return { token: res, jwtData };
  }

  public async activeAccount(account: string, activeCode: string): Promise<boolean> {
    const findUser = await this.user.findOne({ email: account });
    if (!findUser) {
      UserException.userNotFound();
    }
    if (findUser.currentStep != CurrentStepEnum.REGISTERED) {
      UserException.accountVerified();
    }
    const activeTime = new Date();
    const { otpauthUrl, base32 } = this.authenticationService.getTwoFactorAuthenticationCode(findUser.email);

    if (activeCode == findUser.activeCode) {
      await this.user.updateOne(
        { _id: findUser._id },
        { activeTime, currentStep: CurrentStepEnum.EMAIL_VERIFIED, otpauthUrl, twoFactorAuthenticationCode: base32 },
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
    }
    if (!findUser.otpauthUrl) {
      UserException.accountNotVerify();
    }

    return findUser.otpauthUrl;
  };

  public enableTwoFactorAuthentication = async (enable2FaDTO: Enable2FaDTO, user: User): Promise<boolean> => {
    if (user.security?.isEnable2Fa) {
      UserException.enabled2FA();
    }
    const verifyOpCode = this.authenticationService.verifyTwoFactorAuthenticationCode(enable2FaDTO.authCode, user.twoFactorAuthenticationCode);
    if (verifyOpCode) {
      const security = user.security;
      security.isEnable2Fa = true;
      const res = await this.user.updateOne({ _id: user._id }, { currentStep: CurrentStepEnum.SETUP_2FA_COMPLETED, security });
      return !!res;
    } else {
      UserException.invalidOpcode();
    }
  };

  public responseQRcode = async (otpauthUrl: string, response: Response) => {
    this.authenticationService.respondWithQRCode(otpauthUrl, response);
  };

  public setupWallet = async (dto: SetupWalletDTO, user: User): Promise<WalletDTO> => {
    if (user.security.isSetupWallet) {
      UserException.walletInstaller();
    }
    let walletDTO: WalletDTO = new WalletDTO();
    const transactionResponse = await this.createNewMerchantContract(dto.address);
    walletDTO = { ...walletDTO, ...transactionResponse, currencies: user.blockchainData.currencies };
    const security = user?.security;
    security.isSetupWallet = true;
    await this.user.updateOne({ _id: user._id }, { currentStep: CurrentStepEnum.SETUP_WALLET_COMPLETED, security, blockchainData: walletDTO });
    return walletDTO;
  };

  public setupCurrency = async (dto: SetupCurrencyDTO, user: User): Promise<any> => {
    if (user.currentStep == CurrentStepEnum.VERIFIED) {
      UserException.accountNotVerify();
    }

    const token_price_arr = await CryptoPriceModel.find({ symbol: { $in: dto.currencies } }, { _id: 1 });
    const res = await UserModel.updateOne({ _id: user._id }, { 'blockchainData.currencies': token_price_arr });

    return res;
  };

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
  private createNewMerchantContract = async (address: string): Promise<any> => {
    try {
      const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
      let wallet = new ethers.Wallet(OPERATOR_PRIVATE_KEY);
      wallet = wallet.connect(jsonProvider);
      const contract = new ethers.Contract(FACTORY_ADDRESS, MerChantFactoryJson.abi, wallet);
      const response = await contract.createNewMerchant(address);
      const response2 = await response.wait();
      const contractAddress = await contract.merchantPair(address);
      return { transactionHash: response2.transactionHash, address, contract: contractAddress };
    } catch (error) {
      UserException.blockchainError(error.reason);
    }
  };

  public sendForgotCodeToEmail = async (email: string): Promise<boolean> => {
    const findUser = await this.user.findOne({ email });
    if (!findUser) {
      UserException.userNotFound();
    } else {
      const now = Date.now();

      if (now <= new Date(findUser.lastTimeSendEmailForgotPassword).getTime() + 60 * 1000) {
        UserException.resendEmailSoFast();
      }
      const randomString = generateRandomString(6);
      const verifyUrl = `${FRONT_END_URL}?account=${email}&forgotCode=${randomString}`;

      const sended = await this.emailService.sendResetPassword(email, verifyUrl);
      const res = await this.user.updateOne({ _id: findUser._id }, { forgotPassCode: randomString, lastTimeSendEmailForgotPassword: now });

      return !!res;
    }
  };

  public async changePassword(changePasswordDTO: ChangePasswordDTO): Promise<boolean> {
    const findUser = await this.user.findOne({ email: changePasswordDTO.email });
    if (!findUser) {
      UserException.userNotFound();
    }

    if (!changePasswordDTO.forgotPassCode || changePasswordDTO.forgotPassCode != findUser.forgotPassCode) {
      UserException.invalidPassCode();
    }
    const now = Date.now();
    if (now >= new Date(findUser.lastTimeSendEmailForgotPassword).getTime() + 60 * 10 * 1000) {
      UserException.overTenMinutes();
    }
    if (changePasswordDTO.forgotPassCode == findUser.forgotPassCode) {
      const hashedPassword = await hash(changePasswordDTO.newPassword, 10);

      await this.user.updateOne({ _id: findUser._id }, { forgotPassCode: null, password: hashedPassword });
      return true;
    } else {
      UserException.invalidActiveCode();
    }
  }
}
export default UserService;
