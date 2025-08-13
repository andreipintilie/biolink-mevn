import mongoose from 'mongoose';
import { IUser } from '@/shared/index.js';

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
