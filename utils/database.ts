import mongoose from 'mongoose';

interface MongooseGlobal {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Explicitly cast global as any or to a custom type
let cached = (global as unknown as { mongoose: MongooseGlobal }).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<mongoose.Connection> => {
  mongoose.set('strictQuery', true);

  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      dbName: 'Inzider', // Set your database name
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI as string, options)
      .then((mongoose) => {
        console.log('MongoDB connected');
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection cached');
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    throw error;
  }
};

export default dbConnect;
