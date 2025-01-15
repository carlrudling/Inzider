declare var process: {
  env: {
    NEXT_PUBLIC_SERVER_URL: string;
    STRIPE_SECRET_KEY: string;
    [key: string]: string | undefined;
  };
};

import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      };
    }
  }
}

export {};
