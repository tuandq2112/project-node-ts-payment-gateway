import { JwtInfo } from '@/dtos/jwtInfo.dto';
import { ethers } from 'ethers';

export const validateSignature = (info: JwtInfo): boolean => {
  return ethers.utils.verifyMessage(info.message, info.signature) === info.address;
};
