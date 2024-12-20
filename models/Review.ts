import { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: Schema.Types.ObjectId; // link to User (or Creator) who wrote review
  userName: string; // capture at review time, or populate when needed
  rating: number;
  text: string;
  createdAt: Date;
}

export const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
