// models/Discount.ts
import { Schema, model, models, Document, Model } from 'mongoose';

export interface IDiscount extends Document {
  code: string;
  label?: string;
  amount?: number; // Percentage or fixed discount
  startDate?: Date;
  endDate?: Date;
  usageQuantity?: number; // How many times can this be used
  appliesTo?: 'trip' | 'goto' | 'commission';
  // If appliesTo='commission', it's a discount for creators' commissions.

  createdAt?: Date;
  updatedAt?: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    code: { type: String, unique: true, required: true },
    label: { type: String },
    amount: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    usageQuantity: { type: Number },
    appliesTo: {
      type: String,
      enum: ['trip', 'goto', 'commission'],
      default: 'trip',
    },
  },
  { timestamps: true }
);

const Discount: Model<IDiscount> =
  models.Discount || model<IDiscount>('Discount', DiscountSchema);
export default Discount;
