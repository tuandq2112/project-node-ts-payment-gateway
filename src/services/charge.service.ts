import { TransactionTypeEnum } from '@/enums/TransactionTypeEnum';
import { Charge } from '@/interfaces/charge.interface';
import ChargeModel from '@/models/charge.model';
import { generateApiKey } from 'generate-api-key';

class ChargeService {
  public async createInvoice(charge: Charge): Promise<any> {
    const instance = await ChargeModel.create(charge);

    return instance;
  }

  public async getInvoices(userId: string, transactionType: TransactionTypeEnum, skip: number, limit: number): Promise<any> {
    const list = await ChargeModel.find(
      {
        owner: userId,
        transactionType: transactionType,
      },
      // { _id: 0, __v: 0 },
    )
      .skip(skip)
      .limit(limit);

    return list;
  }

  public async generateCode(): Promise<string> {
    let newCode: string;
    let flag = true;
    while (flag) {
      newCode = generateApiKey({ method: 'string', length: 12, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }).toString();
      let foundApiKey = await ChargeModel.findOne({
        code: newCode,
      });

      if (foundApiKey == null) {
        flag = false;
      }
    }

    return newCode;
  }

  public async getInvoiceByCode(code: string): Promise<any> {
    const instance = await ChargeModel.findOne(
      {
        code: code,
      },
      {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    ).populate({
      path: 'owner',
      select: '-_id blockchainData.contract',
    });

    return instance;
  }
}

export default ChargeService;
