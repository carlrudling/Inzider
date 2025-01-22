const config = {
  stripe: {
    clientId: 'ca_RXMDgelzpQADGelgbsz5ME0dx7ayIlER',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
};

export default config;
