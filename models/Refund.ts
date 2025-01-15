import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRefund extends Document {
  purchaseId: Types.ObjectId;
  buyer: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: string;
  creatorId: Types.ObjectId;
  amount: number;
  currency: string;
  reason: string;
  stripeRefundId: string;
  status: 'pending' | 'completed' | 'failed';
  processedBy: Types.ObjectId; // The creator who processed the refund
  createdAt: Date;
  updatedAt: Date;
}

const refundSchema = new Schema(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: 'Purchase',
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'contentType',
    },
    contentType: {
      type: String,
      required: true,
      enum: ['goto', 'trip'],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    stripeRefundId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Refund ||
  mongoose.model<IRefund>('Refund', refundSchema);
