import { TransactionTypeEnum } from '@/enums/TransactionTypeEnum';

interface Metadata {
  orderId: string;
  orderKey: string;
  source: string;
}

export interface Charge {
  _id: string;

  owner: string;
  transactionType: TransactionTypeEnum;

  name: string;
  description: string;
  memo: string;
  email: string;

  currencyType: string;
  currency: string;
  amount: Number;

  addresses: string[];
  price: Object;

  code: string;
  metatdata: Metadata;
  logoUrl: string;

  status: string;
  context: string;

  expiredAt: Date;
}
