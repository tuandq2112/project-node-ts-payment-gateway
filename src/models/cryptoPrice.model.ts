import { Document, model, Schema } from 'mongoose';
import { CryptoPrice } from '@/interfaces/cryptoprice.interface';
import { CurrentStatusEnum } from '@/enums/StatusEnum';

const cryptoPriceSchema = new Schema(
  {
    address: {
      type: String,
      validate: /^(?:0x)?[0-9a-f]{40}$/,
      required: 'address cannot be blank',
    },
    name: {
      type: String,
      required: 'name cannot be blank',
    },
    symbol: {
      type: String,
      index: { unique: true },
      required: 'symbol cannot be blank',
    },
    decimal: {
      type: Number,
      required: 'decimal cannot be blank',
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
    collection: 'coll_token_price',
    timestamps: true,
    versionKey: false,
  },
);

const CryptoPriceModel = model<CryptoPrice & Document>('coll_token_price', cryptoPriceSchema);

export default CryptoPriceModel;
