import { IsEthereumAddress } from 'class-validator';

export class SetupWalletDTO {
  @IsEthereumAddress()
  public address: string;
}
