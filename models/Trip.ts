// models/trip.ts

import { Schema, model, models, Document, Model } from 'mongoose';
import { IReview, ReviewSchema } from './Review';
import { IDay, DaySchema } from './Day';

interface ISpecific {
  label: string;
  value: string;
}

export interface ITrip extends Document {
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
  startDate: Date;
  endDate: Date;
  days: IDay[];
  lastEdited?: Date;
  reviews: IReview[];
  avgRating: number;
  ratingAmount: number;
  slides?: { type: 'image' | 'video'; src: string }[];
  buyers: Schema.Types.ObjectId[];
  specifics: ISpecific[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TripSchema = new Schema<ITrip>(
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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: [DaySchema],
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
    specifics: [
      {
        _id: false,
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Trip: Model<ITrip> = models.Trip || model<ITrip>('Trip', TripSchema);
export default Trip;
