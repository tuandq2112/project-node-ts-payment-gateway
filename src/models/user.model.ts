import { UserStatus } from '@/enums/UserStatus';
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
      enum: UserStatus,
      require: true,
      default: UserStatus.PENDING,
    },
    activeCode: { type: String },
    lastTimeGenerateActiveCode: { type: Date },
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('user', userSchema);

export default UserModel;
