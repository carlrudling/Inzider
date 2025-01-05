import { Schema, model, models, Document, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  username: string;
  image?: string;
  purchases?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String, required: true, unique: true },
    image: { type: String },
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Purchase' }],
  },
  {
    timestamps: true,
  }
);

export default models.User || model<IUser>('User', userSchema);
