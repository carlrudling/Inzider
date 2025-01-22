// models/day.ts

import { Schema, Document } from 'mongoose';
import { ISpot, SpotSchema } from './Spot';

export interface IDay extends Document {
  date: Date;
  spots: ISpot[];
}

export const DaySchema = new Schema<IDay>({
  date: { type: Date, required: true },
  spots: [SpotSchema],
});
