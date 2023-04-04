import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';
import { Charge } from '@/interfaces/charge.interface';
import ChargeService from '@/services/charge.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TransactionTypeEnum } from '@/enums/TransactionTypeEnum';
import { DAY_EXPIRED_INVOICE } from '@/config';
import ExchangeRateService from '@/services/exchangerate.service';
import { CurrentStepEnum } from '@/enums/StepEnum';
import { UserException } from '@/exceptions/UserException';

class ChargeController extends BaseResponseController {
  public chargeService = new ChargeService();
  public exchangeRateService = new ExchangeRateService();

  public createInvoice = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (user.currentStep != CurrentStepEnum.SETUP_WALLET_COMPLETED && user.currentStep != CurrentStepEnum.VERIFIED) {
        next(UserException.walletInstaller());
      }
      let current_date: Date = new Date();
      let nowAfter2days = new Date(current_date.setDate(current_date.getDate() + Number(DAY_EXPIRED_INVOICE)));
      let date_String: string = nowAfter2days.toString();
      date_String = current_date.toISOString();

      const newCode = await this.chargeService.generateCode();
      const { addresses, price } = await this.exchangeRateService.convertWei(req.body.currency, user.blockchainData.currencies, req.body.amount);

      const charge: Charge = {
        code: newCode,
        owner: user._id,
        transactionType: TransactionTypeEnum.INVOICE,
        expiredAt: date_String,
        price,
        addresses,
        ...req.body,
      };
      const result = await this.chargeService.createInvoice(charge);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };
  public getInvoices = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const skip: number = req.query.page ? (Number(req.query.page) - 1) * Number(req.query.limit) : 0;
      const limit: number = req.query.limit ? Number(req.query.limit) : 50;
      const resultList = await this.chargeService.getInvoices(req.user._id, TransactionTypeEnum.INVOICE, skip, limit);
      this.response(res, resultList);
    } catch (error) {
      next(error);
    }
  };
  public getInvoiceByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.params.code;
      let result = await this.chargeService.getInvoiceByCode(code);

      // let strResult = JSON.stringify(result);
      // let newResult = JSON.parse(strResult);
      // let { owner, ...x } = newResult;
      // x.contract = owner.blockchainData.contract;
      // this.response(res, x);

      let strResult = JSON.stringify(result);
      let newResult = JSON.parse(strResult);
      let { _, owner, transactionType, email, currencyType, currency, amount, addresses, price, status, expiredAt } = newResult;
      this.response(res, {
        code,
        transactionType,
        contract: owner.blockchainData.contract,
        email,
        currencyType,
        currency,
        amount,
        addresses,
        price,
        status,
        expiredAt,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ChargeController;
