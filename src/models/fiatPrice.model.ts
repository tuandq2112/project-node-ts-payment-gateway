import { Document, model, Schema } from 'mongoose';
import { FiatPrice } from '@/interfaces/fiatprice.interface';
import { CurrentStatusEnum } from '@/enums/StatusEnum';

const fiatPriceSchema = new Schema(
  {
    name: {
      type: String,
      required: 'name cannot be blank',
    },
    symbol: {
      type: String,
      index: { unique: true },
      required: 'symbol cannot be blank',
    },
    price: {
      type: Number,
      // required: "price cannot be blank",
    },
    status: {
      type: String,
      enum: CurrentStatusEnum,
      required: true,
      default: CurrentStatusEnum.ACTIVE,
    },
    timestamp: {
      type: Date,
    },
  },
  {
    collection: 'coll_fiat_price',
    timestamps: true,
    versionKey: false,
  },
);

const FiatPriceModel = model<FiatPrice & Document>('coll_fiat_price', fiatPriceSchema);

export default FiatPriceModel;
