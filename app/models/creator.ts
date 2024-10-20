import { Schema, model, models, Document, Model } from 'mongoose';

// Define the ICreator interface
export interface ICreator extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  socialmedia: {
    platform: string;
    link: string;
  }[];
  username: string;
  image?: string;
  avgRating: number;
  ratingAmount: number;
  trips: Schema.Types.ObjectId[]; // Array of Trip references
  createdAt?: Date;
  updatedAt?: Date;
  password?: string; // Make password optional
}

// Define the CreatorSchema schema
const CreatorSchema = new Schema<ICreator>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: false, // Make password not required
    },
    socialmedia: [
      {
        platform: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
          validate: {
            validator: function (v: string) {
              return /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\w\-\._~:/?#[\]@!$&'()*+,;=.])*$/gm.test(
                v
              ); // Basic URL validation
            },
            message: (props: any) => `${props.value} is not a valid URL!`,
          },
        },
      },
    ],
    username: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingAmount: {
      type: Number,
      default: 0,
    },
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trip', // Reference to Trip model
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Check if the model already exists, otherwise create it
const Creator: Model<ICreator> =
  models.Creator || model<ICreator>('Creator', CreatorSchema);

export default Creator;
