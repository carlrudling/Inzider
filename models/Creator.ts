import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICreator extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  password?: string;
  image?: string;
  description?: string;
  instagram?: string;
  tiktok?: string;
  xLink?: string;
  youtube?: string;
  profileImage?: string;
  backgroundImage?: string;
  textColor?: string;
  tripButtonColor?: string;
  tripButtonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  myTrips: Types.ObjectId[];
  myGotos: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const creatorSchema = new Schema<ICreator>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    description: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    xLink: { type: String },
    youtube: { type: String },
    profileImage: { type: String },
    backgroundImage: { type: String },
    textColor: { type: String },
    tripButtonColor: { type: String },
    tripButtonText: { type: String },
    buttonColor: { type: String },
    buttonTextColor: { type: String },
    myTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    myGotos: [{ type: Schema.Types.ObjectId, ref: 'GoTo' }],
  },
  {
    timestamps: true,
  }
);

export default models.Creator || model<ICreator>('Creator', creatorSchema);
