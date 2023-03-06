import { User } from '@interfaces/users.interface';
import { Document, model, Schema } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    biography: {
      type: String,
      maxLength: 2000,
    },
    email: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
