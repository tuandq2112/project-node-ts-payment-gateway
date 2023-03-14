import { LoginProcessEnum } from '@/enums/LoginProcessEnum';
import { UserStatusEnum } from '@/enums/UserStatus';

export interface User {
  _id: string;
  email: string;
  password: string;
  status: UserStatusEnum;
  activeCode: string;
  lastTimeGenerateActiveCode: Date;
  loginProcess: LoginProcessEnum;
  twoFactorAuthenticationCode: string;
  security: {
    isEnable2Fa: boolean;
  };
}
