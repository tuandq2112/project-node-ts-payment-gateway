import { CurrentStepEnum } from '@/enums/StepEnum';
import { User } from '@/interfaces/user.interface';
import { Document, model, Schema } from 'mongoose';

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
    // apikeys: [Schema.Types.ObjectId]
    apikeys: [{ type: Schema.Types.ObjectId, ref: 'apikey' }]
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('user', userSchema);

export default UserModel;
