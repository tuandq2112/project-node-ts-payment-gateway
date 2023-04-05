import { CurrentStatusEnum } from '@/enums/StatusEnum';

export interface FiatPrice {
  _id: string;
  name: string;
  symbol: string;
  price: number;
  status: CurrentStatusEnum;
  timestamp: Date;
}
