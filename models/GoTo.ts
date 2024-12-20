// models/goto.ts

import { Schema, model, models, Document, Model } from 'mongoose';
import { IReview, ReviewSchema } from './Review';
import { ISpot, SpotSchema } from './Spot';

export interface IGoTo extends Document {
  title: string;
  description?: string;
  price: number;
  currency: string;
  creatorId: Schema.Types.ObjectId;
  location?: string;
  discount?: {
    label?: string;
    amount?: number;
    endDate?: Date;
    usageQuantity?: number;
  };
  status: 'edit' | 'launch';
  spots: ISpot[];
  lastEdited?: Date;
  reviews: IReview[];
  avgRating: number;
  ratingAmount: number;
  slides?: { type: 'image' | 'video'; src: string }[];
  buyers: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const GoToSchema = new Schema<IGoTo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: true },
    location: { type: String },
    discount: {
      label: { type: String },
      amount: { type: Number },
      endDate: { type: Date },
      usageQuantity: { type: Number },
    },
    status: { type: String, enum: ['edit', 'launch'], default: 'edit' },
    spots: [SpotSchema],
    lastEdited: { type: Date, default: Date.now },
    reviews: [ReviewSchema],
    avgRating: { type: Number, default: 0 },
    ratingAmount: { type: Number, default: 0 },
    slides: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        src: { type: String, required: true },
      },
    ],
    buyers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const GoTo: Model<IGoTo> = models.GoTo || model<IGoTo>('GoTo', GoToSchema);
export default GoTo;
