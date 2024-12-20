import { Schema, model, models, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  boughtTrips: Schema.Types.ObjectId[];
  boughtGotos: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: true },
    boughtTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    boughtGotos: [{ type: Schema.Types.ObjectId, ref: 'GoTo' }],
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);
export default User;
