import { LoginProcessEnum } from '@/enums/LoginProcessEnum';
import { UserStatusEnum } from '@/enums/UserStatus';
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
    status: {
      type: String,
      enum: UserStatusEnum,
      require: true,
      default: UserStatusEnum.PENDING,
    },
    activeCode: { type: String },
    lastTimeGenerateActiveCode: { type: Date },
    loginProcess: {
      type: String,
      enum: LoginProcessEnum,
      require: true,
      default: LoginProcessEnum.NOTHING,
    },
    twoFactorAuthenticationCode: { type: String },
    security: {
      isEnable2Fa: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('user', userSchema);

export default UserModel;
