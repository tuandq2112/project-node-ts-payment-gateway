import { CurrentStatusEnum } from '@/enums/StatusEnum';
import CryptoPriceModel from '@/models/cryptoPrice.model';
import { CryptoPrice } from '@/interfaces/cryptoprice.interface';
import FiatPriceModel from '@/models/fiatPrice.model';
import { FiatPrice } from '@/interfaces/fiatprice.interface';
import { BigNumber } from 'ethers';

class ExchangeRateService {
  public cryptoPriceModel = CryptoPriceModel;

  public async convert(localCurrency: string, amount: number): Promise<any> {
    const instance = await this.cryptoPriceModel.find(
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
    const instance = await CryptoPriceModel.find(
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
      const instanceLocal = await FiatPriceModel.findOne(
        {
          symbol: localCurrency,
        },
        { _id: 0, __v: 0, createdAt: 0 },
      );

      let result = this.convertPriceLocalWei(instanceLocal, instance, amount);
      return { addresses: addresses, price: result };
    }
  }

  public async setupCryptoPrice(cryptoPrice: any, cond: any): Promise<boolean> {
    const instance = await CryptoPriceModel.updateOne(
      cond, // { symbol: cryptoPrice.symbol },
      cryptoPrice,
      {
        upsert: true,
      },
    );

    return instance.acknowledged;
  }

  private convertPriceUSD = (cryptoPriceList: CryptoPrice[], amount: Number): any => {
    const res = [];
    for (const cryptoPrice of cryptoPriceList) {
      if (cryptoPrice.symbol != 'VND') {
        let element = {
          amount: Number(amount) / Number(cryptoPrice.price),
          currency: cryptoPrice.symbol,
          rate: {
            'usd-usd': 1,
          },
        };
        element.rate[`${cryptoPrice.symbol.toLowerCase()}-usd`] = cryptoPrice.price;
        res.push(element);
      }
    }

    return res;
  };

  private convertPriceLocal = (instanceLocal: FiatPrice, cryptoPriceList: CryptoPrice[], amount: Number): any => {
    const res = [];
    for (const cryptoPrice of cryptoPriceList) {
      let element = {
        amount: Number(amount) / Number(cryptoPrice.price) / Number(instanceLocal.price),
        currency: cryptoPrice.symbol,
        rate: {},
      };
      element.rate[`${cryptoPrice.symbol.toLowerCase()}-usd`] = cryptoPrice.price;
      res.push(element);
    }

    return res;
  };

  private convertPriceUSDWei = (cryptoPriceList: CryptoPrice[], amount: Number): any => {
    const res = [];
    for (const cryptoPrice of cryptoPriceList) {
      let element = {
        amountWei: (Number(amount) / Number(cryptoPrice.price)) * 10 ** cryptoPrice.decimal,
        amount: Number(amount) / Number(cryptoPrice.price),
        currency: cryptoPrice.symbol,
        address: cryptoPrice.address,
        rate: {
          'usd-usd': 1,
        },
      };
      element.rate[`${cryptoPrice.symbol.toLowerCase()}-usd`] = cryptoPrice.price;
      res.push(element);
    }

    return res;
  };

  private convertPriceLocalWei = (instanceLocal: FiatPrice, cryptoPriceList: CryptoPrice[], amount: Number): any => {
    const res = [];
    for (const cryptoPrice of cryptoPriceList) {
      let amountResult = Number(amount) / Number(cryptoPrice.price) / Number(instanceLocal.price);
      let element = {
        amountWei: (amountResult * 10 ** cryptoPrice.decimal).toString(),
        amount: amountResult,
        currency: cryptoPrice.symbol,
        address: cryptoPrice.address,
        rate: {},
      };
      element.rate[`${instanceLocal.symbol.toLowerCase()}-usd`] = instanceLocal.price;
      element.rate[`${cryptoPrice.symbol.toLowerCase()}-usd`] = cryptoPrice.price;
      res.push(element);
    }

    return res;
  };
}
export default ExchangeRateService;
