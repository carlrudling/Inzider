import { Schema, model, models, Document, Model } from 'mongoose';

export interface IPurchase extends Document {
  userId: Schema.Types.ObjectId;
  contentId: Schema.Types.ObjectId;
  contentType: 'trip' | 'goto';
  amount: number;
  currency: string;
  stripePaymentId: string;
  creatorId: Schema.Types.ObjectId;
  creatorAmount: number; // 80% of amount
  platformAmount: number; // 20% of amount
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: Schema.Types.ObjectId, required: true },
    contentType: {
      type: String,
      enum: ['trip', 'goto'],
      required: true,
      set: (v: string) => v.toLowerCase(),
      validate: {
        validator: (v: string) => ['trip', 'goto'].includes(v.toLowerCase()),
        message: 'contentType must be either "trip" or "goto"',
      },
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    stripePaymentId: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: true },
    creatorAmount: { type: Number, required: true },
    platformAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

// Create indexes for common queries
PurchaseSchema.index(
  { userId: 1, contentId: 1, contentType: 1 },
  { unique: true }
);
PurchaseSchema.index({ stripePaymentId: 1 }, { unique: true });
PurchaseSchema.index({ creatorId: 1 });
PurchaseSchema.index({ status: 1 });

// Virtual to get the referenced model name
PurchaseSchema.virtual('contentModel').get(function () {
  return this.contentType === 'trip' ? 'Trip' : 'GoTo';
});

const Purchase: Model<IPurchase> =
  models.Purchase || model<IPurchase>('Purchase', PurchaseSchema);
export default Purchase;
