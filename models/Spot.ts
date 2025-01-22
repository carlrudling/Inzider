import { Schema, Document } from 'mongoose';

export interface ISpecific {
  label: string;
  value: string;
}

const SpecificSchema = new Schema<ISpecific>({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

export interface IMedia {
  type: 'image' | 'video';
  src: string;
}

const MediaSchema = new Schema<IMedia>({
  type: { type: String, enum: ['image', 'video'], required: true },
  src: { type: String, required: true },
});

export interface ISpot extends Document {
  title: string;
  description?: string;
  specifics?: ISpecific[];
  slides?: IMedia[]; // Rename field in schema to slides
  location?: string;
}

export const SpotSchema = new Schema<ISpot>({
  title: { type: String, required: true },
  description: { type: String },
  specifics: [SpecificSchema],
  slides: [MediaSchema], // Use slides here instead of media
  location: { type: String },
});
