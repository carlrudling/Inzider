import { Schema, model, models, Document, Model } from 'mongoose';

// Define the IReview interface
export interface IReview extends Document {
  rating: number;
  text: string;
  email: string; // Email of the person leaving the review (buyer)
  createdAt: Date;
}

// Define the IBuyer interface
export interface IBuyer extends Document {
  email: string;
  purchaseDate: Date;
}

// Define interfaces for the blocks (TextBlock, DetailsBlock, LocationBlock)
interface TextBlock {
  type: 'TextBlock';
  title: string;
  text: string;
}

interface DetailsBlock {
  type: 'DetailsBlock';
  title: string;
  details: { label: string; value: string }[];
}

interface LocationBlock {
  type: 'LocationBlock';
  address: string;
}

// Define the Spot interface
export interface ISpot extends Document {
  title: string;
  icon?: string; // Optional icon for the spot
  media?: { type: 'image' | 'video'; src: string }[]; // Optional media (images/videos)
  blocks?: (TextBlock | DetailsBlock | LocationBlock)[]; // Array of content blocks
}

// Define the Day interface
export interface IDay extends Document {
  dayNumber: number;
  spots: ISpot[]; // Array of spots for each day
}

// Define the Trip interface
export interface ITrip extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  price: number;
  creator: Schema.Types.ObjectId; // Reference to Creator model
  reviews: IReview[]; // Array of reviews
  avgRating: number;
  ratingAmount: number;
  slides: { type: 'image' | 'video'; src: string }[]; // Media content like images or videos
  buyers: IBuyer[]; // Array of buyers
  days: IDay[]; // Array of days in the trip
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the SpotSchema for spots within each day
const SpotSchema = new Schema<ISpot>({
  title: {
    type: String,
    required: true,
  },
  icon: String, // Optional icon
  media: [
    {
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
      src: {
        type: String,
        required: true,
      },
    },
  ],
  blocks: [
    {
      type: {
        type: String,
        enum: ['TextBlock', 'DetailsBlock', 'LocationBlock'],
        required: true,
      },
      title: { type: String, required: false },
      text: { type: String, required: false },
      details: { type: [{ label: String, value: String }], required: false },
      address: { type: String, required: false },
    },
  ],
});

// Define the DaySchema for days within each trip
const DaySchema = new Schema<IDay>({
  dayNumber: {
    type: Number,
    required: true,
  },
  spots: [SpotSchema], // Array of spots within each day
});

// Define the TripSchema
const TripSchema = new Schema<ITrip>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Creator',
      required: true,
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        text: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],
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
    slides: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        src: {
          type: String,
          required: true,
        },
      },
    ],
    buyers: [
      {
        email: {
          type: String,
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    days: [DaySchema], // Array of days in the trip
  },
  { timestamps: true }
);

const Trip: Model<ITrip> = models.Trip || model<ITrip>('Trip', TripSchema);
export default Trip;
