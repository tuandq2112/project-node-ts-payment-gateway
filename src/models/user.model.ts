import { CurrentStepEnum } from '@/enums/StepEnum';
import { User } from '@/interfaces/user.interface';
import { Document, model, Schema } from 'mongoose';
const Security: Schema = new Schema({
  isEnable2Fa: { type: Boolean, default: false },
  isSetupWallet: { type: Boolean, default: false },
});
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
    security: { type: Security, default: {} },
    otpauthUrl: { type: String },
    verifyOpCode: { type: Boolean, default: false },
    blockchainData: {
      transactionHash: { type: String },
      address: { type: String },
      contract: { type: String },
      currencies: [{ type: Schema.Types.ObjectId, ref: 'coll_token_price' }],
    },
    apikeys: [{ type: Schema.Types.ObjectId, ref: 'coll_apikey' }],
    forgotPassCode: { type: String, length: 6 },
    lastTimeSendEmailForgotPassword: { type: Date },
  },
  {
    collection: 'coll_user',
    timestamps: true,
    versionKey: false,
  },
);

const UserModel = model<User & Document>('coll_user', userSchema);

export default UserModel;
