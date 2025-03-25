import mongoose, { Connection } from 'mongoose';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(retries = 3): Promise<Connection> {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000, // Connection timeout after 10 seconds
      dbName: 'Inzider', // From utils/database.ts
    };

    mongoose.set('strictQuery', true); // From utils/database.ts

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB connected');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection cached');
  } catch (e) {
    if (retries > 0) {
      console.log(
        `Database connection failed, retrying... (${retries} attempts left)`
      );
      cached.promise = null;
      return dbConnect(retries - 1);
    }
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
