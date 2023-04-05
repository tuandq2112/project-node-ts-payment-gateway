import { CurrentStatusEnum } from '@/enums/StatusEnum';
import TokenPriceModel from '@/models/tokenPrice.model';
import { TokenPrice } from '@/interfaces/tokenprice.interface';
import FiatPriceModel from '@/models/fiatPrice.model';
import { FiatPrice } from '@/interfaces/fiatprice.interface';

class ExchangeRateService {
  public tokenPriceModel = TokenPriceModel;

  public async convert(localCurrency: string, amount: number): Promise<any> {
    const instance = await this.tokenPriceModel.find(
      {
        status: CurrentStatusEnum.ACTIVE,
      },
      { _id: 0, __v: 0, createdAt: 0 },
    );

    if (localCurrency == 'USD') {
      let result = this.convertPriceUSD(instance, amount);
      return result;
    } else {
      const instanceLocal = await FiatPriceModel.findOne(
        {
          symbol: localCurrency,
        },
        { _id: 0, __v: 0, createdAt: 0 },
      );

      let result = this.convertPriceLocal(instanceLocal, instance, amount);
      return result;
    }
  }

  public async convertWei(localCurrency: string, currencies: string[], amount: Number): Promise<any> {
    const instance = await TokenPriceModel.find(
      {
        status: CurrentStatusEnum.ACTIVE,
        _id: { $in: currencies },
      },
      // { _id: 0, __v: 0, createdAt: 0 },
    );

    let addresses = [];
    for (const i of instance) {
      addresses.push({
        address: i.address,
        currency: i.symbol,
      });
    }

    if (localCurrency == 'USD') {
      let result = this.convertPriceUSDWei(instance, amount);
      return { addresses, price: result };
    } else {
      const instanceLocal = await this.tokenPriceModel.findOne(
        {
          symbol: localCurrency,
        },
        { _id: 0, __v: 0, createdAt: 0 },
      );

      let result = this.convertPriceLocalWei(instanceLocal, instance, amount);
      return { addresses: addresses, price: result };
    }
  }

  public async setupTokenPrice(tokenPrice: any, cond: any): Promise<boolean> {
    const instance = await TokenPriceModel.updateOne(
      cond, // { symbol: tokenPrice.symbol },
      tokenPrice,
      {
        upsert: true,
      },
    );

    return instance.acknowledged;
  }

  private convertPriceUSD = (tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      if (tokenPrice.symbol != 'VND') {
        let element = {
          amount: Number(amount) / Number(tokenPrice.price),
          currency: tokenPrice.symbol,
          rate: {
            'usd-usd': 1,
          },
        };
        element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
        res.push(element);
      }
    }

    return res;
  };

  private convertPriceLocal = (instanceLocal: FiatPrice, tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      let element = {
        amount: Number(amount) / Number(tokenPrice.price) / Number(instanceLocal.price),
        currency: tokenPrice.symbol,
        rate: {},
      };
      element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
      res.push(element);
    }

    return res;
  };

  private convertPriceUSDWei = (tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      let element = {
        amountWei: (Number(amount) / Number(tokenPrice.price)) * 10 ** tokenPrice.decimal,
        amount: Number(amount) / Number(tokenPrice.price),
        currency: tokenPrice.symbol,
        address: tokenPrice.address,
        rate: {
          'usd-usd': 1,
        },
      };
      element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
      res.push(element);
    }

    return res;
  };

  private convertPriceLocalWei = (instanceLocal: TokenPrice, tokenPriceList: TokenPrice[], amount: Number): any => {
    const res = [];
    for (const tokenPrice of tokenPriceList) {
      let element = {
        amountWei: (Number(amount) / Number(tokenPrice.price)) * 10 ** tokenPrice.decimal,
        amount: Number(amount) / Number(tokenPrice.price) / Number(instanceLocal.price),
        currency: tokenPrice.symbol,
        address: tokenPrice.address,
        rate: {},
      };
      element.rate[`${tokenPrice.symbol.toLowerCase()}-usd`] = tokenPrice.price;
      res.push(element);
    }

    return res;
  };
}
export default ExchangeRateService;
