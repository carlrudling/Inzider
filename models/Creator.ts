import { Schema, model, models, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICreator extends Document {
  email: string;
  password?: string;
  username: string;
  name: string;
  description?: string;
  instagram?: string;
  xLink?: string;
  tiktok?: string;
  youtube?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  textColor?: string;
  backgroundImage?: string;
  profileImage?: string;
  stripeAccountId?: string;
}

const CreatorSchema = new Schema<ICreator>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    xLink: {
      type: String,
      required: false,
    },
    tiktok: {
      type: String,
      required: false,
    },
    youtube: {
      type: String,
      required: false,
    },
    buttonColor: {
      type: String,
      required: false,
    },
    buttonTextColor: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
    },
    backgroundImage: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    stripeAccountId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
CreatorSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Creator: Model<ICreator> =
  models.Creator || model<ICreator>('Creator', CreatorSchema);

export default Creator;
