import { Document, model, Schema } from 'mongoose';
import { Charge } from '@/interfaces/charge.interface';
import { TransactionTypeEnum } from '@/enums/TransactionTypeEnum';
import { ChargeStatusEnum, ContextChargeStatusEnum } from '@/enums/StatusEnum';

const metadataSchema = new Schema({
  orderId: {
    type: String,
    required: 'orderId cannot be blank',
  },
  orderKey: {
    type: String,
    required: 'orderKey cannot be blank',
  },
  source: {
    type: String,
    required: 'source cannot be blank',
  },
});

const chargeSchema = new Schema(
  {
    code: {
      type: String,
      index: { unique: true },
      require: [true, 'code cannot be blank'],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'coll_user',
      require: [true, 'owner cannot be blank'],
    },

    transactionType: {
      type: String,
      enum: TransactionTypeEnum,
      require: [true, 'transactionType cannot be blank'],
    },

    name: {
      type: String,
    },
    description: {
      type: String,
    },
    memo: {
      type: String,
    },
    email: {
      type: String,
    },

    currencyType: {
      type: String,
    },
    currency: {
      type: String,
    },
    amount: {
      type: Number,
    },

    addresses: {
      type: Array,
      fields: {
        currency: { type: String },
        address: { type: String },
      },
    },

    price: {
      type: Object,
    },

    metatdata: {
      type: metadataSchema,
    },
    // metatdata: {
    //   orderId: {
    //     type: String,
    //     required: 'orderId cannot be blank',
    //   },
    //   orderKey: {
    //     type: String,
    //     required: 'orderKey cannot be blank',
    //   },
    //   source: {
    //     type: String,
    //     required: 'source cannot be blank',
    //   },
    // },
    logoUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ChargeStatusEnum,
      require: true,
      default: ChargeStatusEnum.NEW,
    },
    context: {
      type: String,
      enum: ContextChargeStatusEnum,
      // default: ContextChargeStatusEnum.MANUAL,
      required: function () {
        return this.status == ChargeStatusEnum.UNRESOLVED;
      },
    },
    expiredAt: {
      type: Date,
    },
  },
  {
    collection: 'coll_charge',
    timestamps: true,
    versionKey: false,
  },
);

const ChargeModel = model<Charge & Document>('coll_charge', chargeSchema);

export default ChargeModel;
