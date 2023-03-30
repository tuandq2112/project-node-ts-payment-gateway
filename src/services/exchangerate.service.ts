import { CurrentStatusEnum } from '@/enums/StatusEnum';
import TokenPriceModel from '@/models/tokenPrice.model';
import {TokenPrice} from '@/interfaces/tokenprice.interface';

class ExchangeRateService {
  public tokenPriceModel = TokenPriceModel;

  public async convert(localCurrency: string, amount: number): Promise<any> {
    // get all token price active

    const instance = await this.tokenPriceModel.find(
        {
          status: CurrentStatusEnum.ACTIVE,
        },
        { _id: 0, __v: 0, createdAt: 0 }
      );

    if (localCurrency == "USD") {
      let result = this.convertPriceUSD(instance, amount);
      return result;
    } else {
      const instanceVND = await this.tokenPriceModel.findOne(
        {
          symbol: "VND",
        },
        { _id: 0, __v: 0, createdAt: 0 }
      );

      let result = this.convertPriceVND(instanceVND, instance, amount);
      return result;
    }
  }

  public async setupTokenPrice(tokenPrice: any, cond: any): Promise<boolean> {
    const instance = await TokenPriceModel.updateOne(
      cond, // { symbol: tokenPrice.symbol },
      tokenPrice,
      {
        upsert: true,
      }
    );
  
    return instance.acknowledged;
  }

  private convertPriceUSD = (tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      if (tokenPrice.symbol != "VND") {
        let element = {
          amount: Number(amount)/Number(tokenPrice.price),
          currency: tokenPrice.symbol,
          rate: {
            "usd-usd": 1,
          }
        };
        element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
        res.push(element);
      }
    }

    return res;
  }

  private convertPriceVND = (instanceVND: TokenPrice, tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      if (tokenPrice.symbol != "VND") {
        let element = {
          amount: (Number(amount)/Number(tokenPrice.price))/Number(instanceVND.price),
          currency: tokenPrice.symbol,
          rate: {
            "vnd-usd": instanceVND.price,
          }
        };
        element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
        res.push(element);
      }
    }

    return res;
  }
}
export default ExchangeRateService;
