import { CURRENCY, NETWORK_ID, TRANSACTION_URL } from '@/config';

export class WalletDTO {
  public currency = CURRENCY;
  public networkId = NETWORK_ID;
  public transactionUrl = TRANSACTION_URL;
  public transactionHash: string;
  public address: string;
  public contract: string;
}
