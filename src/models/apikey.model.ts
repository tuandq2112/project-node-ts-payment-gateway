import { Document, model, Schema } from 'mongoose';
import { APIKEY } from '@/interfaces/apikey.interface';
import UserModel from '@models/user.model';
import { CurrentStatusEnum } from '@/enums/StatusEnum';

const apikeySchema: Schema = new Schema(
  {
    apikey: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: Schema.Types.ObjectId, ref: UserModel.collection.collectionName,
      required: true,
    },
    status: {
      type: String,
      enum: CurrentStatusEnum,
      required: true,
      default: CurrentStatusEnum.ACTIVE
    }
  },
  { timestamps: true },
);

const ApiKeyModel = model<APIKEY & Document>('apikey', apikeySchema);

export default ApiKeyModel;
