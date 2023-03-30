import { Document, model, Schema } from 'mongoose';
import { TokenPrice } from '@/interfaces/tokenprice.interface';
const tokenPriceSchema = new Schema(
  {
    name: {
      type: String,
      required: "name cannot be blank",
    },
    symbol: {
      type: String,
      index: { unique: true },
      required: "symbol cannot be blank",
    },
    decimal: {
      type: Number,
      required: "decimal cannot be blank",
    },
    price: {
      type: Number,
      // required: "price cannot be blank",
    },
    status: {
      type: String,
      //   required: "status cannot be blank",
      default: "active",
    },
    timestamp: {
      type: Date,
    },
  },
  {
    collection: "coll_token_price",
    timestamps: true,
    versionKey: false,
  }
);

// const TokenPriceModel = model("TokenPrice", tokenPriceSchema);
const TokenPriceModel = model<TokenPrice & Document>('TokenPrice', tokenPriceSchema);

export default  TokenPriceModel;
