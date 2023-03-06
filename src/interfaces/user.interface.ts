import { UserStatus } from '@/enums/UserStatus';

export interface User {
  email: string;
  password: string;
  status: UserStatus;
  activeCode: string;
  lastTimeGenerateActiveCode: Date;
}
