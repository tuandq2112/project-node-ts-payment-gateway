import { Security } from '@/dtos/user/security.dto';
import { CurrentStep } from '@/enums/LoginProcessEnum';

export interface User {
  _id: string;
  email: string;
  password: string;
  // status: UserStatusEnum;
  activeCode: string;
  lastTimeGenerateActiveCode: Date;
  currentStep: CurrentStep;
  twoFactorAuthenticationCode: string;
  security: Security;
  otpauthUrl: string;
  verifyOpCode: boolean;
}
