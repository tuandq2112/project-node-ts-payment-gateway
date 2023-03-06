import { IsEthereumAddress, IsNotEmpty } from 'class-validator';
export class JwtInfo {
  @IsNotEmpty()
  @IsEthereumAddress()
  public address: string;

  @IsNotEmpty()
  public message: string;

  @IsNotEmpty()
  public signature: string;
}
