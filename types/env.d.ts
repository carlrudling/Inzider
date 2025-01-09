declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_SECRET_KEY: string;
    NEXT_PUBLIC_STRIPE_CLIENT_ID: string;
    NEXT_PUBLIC_URL: string;
  }
}
