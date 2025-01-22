import React from 'react';

const STRIPE_CLIENT_ID = 'ca_RXMDgelzpQADGe1gbsz5ME0dx7ayI1ER';

export default function StripeConnectButton() {
  const redirectUri =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/stripe/connect/callback`
      : '';

  const connectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  // Debug logging
  console.log('Stripe Connect URL:', connectUrl);
  console.log('Redirect URI:', redirectUri);

  return (
    <a
      href={connectUrl}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick={() => console.log('Stripe Connect button clicked')}
    >
      Connect with Stripe
    </a>
  );
}
