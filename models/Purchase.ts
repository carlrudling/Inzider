import mongoose from 'mongoose';

export interface IPurchase extends mongoose.Document {
  buyer: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  contentType: 'goto' | 'trip';
  amount: number;
  currency: string;
  stripePaymentId: string;
  creatorId: mongoose.Types.ObjectId;
  creatorAmount: number;
  platformAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'contentType',
      required: true,
    },
    contentType: {
      type: String,
      enum: ['goto', 'trip'],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    stripePaymentId: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
      required: true,
    },
    creatorAmount: { type: Number, required: true },
    platformAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    refundReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
purchaseSchema.index({ buyer: 1, contentType: 1 });
purchaseSchema.index({ contentId: 1, status: 1 });
purchaseSchema.index({ stripePaymentId: 1 });
purchaseSchema.index({ creatorId: 1 });

export default mongoose.models.Purchase ||
  mongoose.model<IPurchase>('Purchase', purchaseSchema);
