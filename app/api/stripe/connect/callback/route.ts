import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Debug logging
console.log('Environment variables:', {
  hasStripeKey: !!stripeSecretKey,
  keyPrefix: stripeSecretKey?.substring(0, 7),
  keyLength: stripeSecretKey?.length,
  envKeys: Object.keys(process.env).filter((key) => key.includes('STRIPE')),
});

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  // Still allow the code to proceed to redirect user back
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('Received callback with:', { code, error, errorDescription });

    // Handle user denial or errors
    if (error) {
      console.log('User denied access or error occurred:', errorDescription);
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=user_denied', request.url)
      );
    }

    // If no code or stripe isn't configured, redirect back to settings
    if (!code || !stripe) {
      console.log('Missing code or stripe configuration');
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=stripe_not_configured', request.url)
      );
    }

    const session = await getServerSession(authOptions);
    console.log('Session user:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('No authenticated user found');
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=unauthorized', request.url)
      );
    }

    try {
      // Check if creator already has a Stripe account
      await dbConnect();
      const creator = await Creator.findOne({ email: session.user.email });

      if (creator?.stripeAccountId) {
        console.log(
          'Creator already has a Stripe account:',
          creator.stripeAccountId
        );
        return NextResponse.redirect(
          new URL('/dashboard/settings?error=already_connected', request.url)
        );
      }

      // Exchange the authorization code for an access token
      console.log('Exchanging code for token...');
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code,
      });

      console.log('Stripe response received:', !!response);

      // Get the connected account ID
      const connectedAccountId = response.stripe_user_id;
      console.log('Connected account ID:', connectedAccountId);

      // Update the creator's record with the connected account ID
      const updatedCreator = await Creator.findOneAndUpdate(
        { email: session.user.email },
        { stripeAccountId: connectedAccountId },
        { new: true }
      );

      console.log('Creator updated:', !!updatedCreator);

      return NextResponse.redirect(
        new URL('/dashboard/settings?success=connected', request.url)
      );
    } catch (stripeError) {
      console.error('Stripe connection error:', stripeError);
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=stripe_error', request.url)
      );
    }
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=unknown', request.url)
    );
  }
}
