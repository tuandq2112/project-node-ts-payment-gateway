import { CurrentStatusEnum } from '@/enums/StatusEnum';

export interface TokenPrice {
  _id: string;
  address: string;
  name: string;
  symbol: string;
  decimal: number;
  price: number;
  status: CurrentStatusEnum;
  timestamp: Date;
}
