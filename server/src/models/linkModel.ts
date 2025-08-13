import mongoose from 'mongoose';
import { ILink } from '@/shared/index';

const LinkSchema = new mongoose.Schema<ILink>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Link = mongoose.model<ILink>('Link', LinkSchema);

export default Link;
