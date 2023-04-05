import exchangeRateService from '@/services/exchangerate.service';
import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';
import { CryptoPrice } from '@interfaces/cryptoprice.interface';

class ExchangeRateController extends BaseResponseController {
  public exchangeRateService = new exchangeRateService();

  public convert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const localCurrency = req.query.localCurrency ? req.query.localCurrency.toString() : 'VND';
      const amount = req.query.amount ? Number(req.query.amount.toString()) : 100000;
      const result: boolean = await this.exchangeRateService.convert(localCurrency, amount);
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public setupCryptoPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoPrice: CryptoPrice = req.body;
      const result: boolean = await this.exchangeRateService.setupCryptoPrice(
        {
          status: cryptoPrice.status,
        },
        {
          symbol: cryptoPrice.symbol,
        },
      );
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };

  public addCryptoPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoPrice: CryptoPrice = req.body;
      const result: boolean = await this.exchangeRateService.setupCryptoPrice(
        {
          name: cryptoPrice.name,
          symbol: cryptoPrice.symbol,
          decimal: cryptoPrice.decimal,
        },
        {
          symbol: cryptoPrice.symbol,
        },
      );
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export default ExchangeRateController;
