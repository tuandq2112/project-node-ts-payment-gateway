import { Security } from '@/dtos/user/security.dto';
import { CurrentStepEnum } from '@/enums/StepEnum';

export interface User {
  _id: string;
  email: string;
  password: string;
  // status: UserStatusEnum;
  activeCode: string;
  lastTimeGenerateActiveCode: Date;
  currentStep: CurrentStepEnum;
  twoFactorAuthenticationCode: string;
  security: Security;
  otpauthUrl: string;
  verifyOpCode: boolean;
  blockchainData: {
    transactionHash: string;
    address: string;
    contract: string;
    currencies: string[];
  };
  apikeys: string;
}
