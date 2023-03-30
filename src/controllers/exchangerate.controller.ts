import exchangeRateService from '@/services/exchangerate.service';
import { NextFunction, Request, Response } from 'express';
import { BaseResponseController } from './base/BaseResponseController';
import { TokenPrice } from '@interfaces/tokenprice.interface';

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

  public setupTokenPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPrice: TokenPrice = req.body;
      const result: boolean = await this.exchangeRateService.setupTokenPrice({
        status: tokenPrice.status
      }, {
        symbol: tokenPrice.symbol
      });
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  }; 

  public addTokenPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPrice: TokenPrice = req.body;
      const result: boolean = await this.exchangeRateService.setupTokenPrice({
        name: tokenPrice.name,
        symbol: tokenPrice.symbol,
        decimal: tokenPrice.decimal,
      }, {
        symbol: tokenPrice.symbol
      });
      this.response(res, result);
    } catch (error) {
      next(error);
    }
  }; 
}

export default ExchangeRateController;
