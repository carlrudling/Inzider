import { Types } from 'mongoose';

export interface IPurchase {
  _id: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: 'goto' | 'trip';
  buyer: {
    _id: Types.ObjectId;
    email: string;
    username: string;
  };
  creatorId: {
    _id: Types.ObjectId;
    username: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentId: string;
}
