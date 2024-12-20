import { Schema, model, models, Document, Model } from 'mongoose';

export interface ICreator extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  description?: string;
  instagram?: string;
  xLink?: string; // For Twitter/X
  tiktok?: string;
  youtube?: string;
  tripButtonColor?: string;
  tripButtonText?: string;
  gotoButtonColor?: string;
  gotoButtonText?: string;
  backgroundImage?: string;
  textColor?: string;
  discountCode?: string; // Or reference a DiscountCode model
  myTrips: Schema.Types.ObjectId[];
  myGotos: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CreatorSchema = new Schema<ICreator>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: false },
    profileImage: { type: String },
    description: { type: String },
    instagram: { type: String },
    xLink: { type: String }, // Twitter/X
    tiktok: { type: String },
    youtube: { type: String },
    tripButtonColor: { type: String },
    tripButtonText: { type: String },
    gotoButtonColor: { type: String },
    gotoButtonText: { type: String },
    backgroundImage: { type: String },
    textColor: { type: String },
    discountCode: { type: String },
    myTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    myGotos: [{ type: Schema.Types.ObjectId, ref: 'GoTo' }],
  },
  { timestamps: true }
);

const Creator: Model<ICreator> =
  models.Creator || model<ICreator>('Creator', CreatorSchema);
export default Creator;
