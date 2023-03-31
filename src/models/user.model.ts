import { CurrentStepEnum } from '@/enums/StepEnum';
import { User } from '@/interfaces/user.interface';
import { Document, model, Schema } from 'mongoose';
import ApiKeyModel from './apikey.model';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    activeCode: { type: String },
    lastTimeGenerateActiveCode: { type: Date },
    currentStep: {
      type: String,
      enum: CurrentStepEnum,
      require: true,
      default: CurrentStepEnum.REGISTERED,
    },
    twoFactorAuthenticationCode: { type: String },
    security: { type: Object },
    otpauthUrl: { type: String },
    verifyOpCode: { type: Boolean, default: false },
    blockchainData: {
      type: Object,
    },
    apikeys: [Schema.Types.ObjectId]
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('user', userSchema);

export default UserModel;
