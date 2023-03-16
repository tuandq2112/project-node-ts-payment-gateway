import { CurrentStep } from '@/enums/LoginProcessEnum';
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
    // status: {
    //   type: String,
    //   enum: UserStatusEnum,
    //   require: true,
    //   default: UserStatusEnum.PENDING,
    // },
    activeCode: { type: String },
    lastTimeGenerateActiveCode: { type: Date },
    currentStep: {
      type: String,
      enum: CurrentStep,
      require: true,
      default: CurrentStep.REGISTERED,
    },
    twoFactorAuthenticationCode: { type: String },
    security: { type: Object },
    otpauthUrl: { type: String },
    verifyOpCode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('user', userSchema);

export default UserModel;
