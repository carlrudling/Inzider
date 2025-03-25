import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';
import Trip from '@/models/Trip';
import GoTo from '@/models/GoTo';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { contentId, contentType } = await req.json();

    if (!contentId || !contentType) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await dbConnect();

    // Find the content and its creator
    let content;
    if (contentType === 'trip') {
      content = await Trip.findById(contentId);
    } else if (contentType === 'goto') {
      content = await GoTo.findById(contentId);
    }

    if (!content) {
      return new NextResponse('Content not found', { status: 404 });
    }

    // Get creator's Stripe account ID
    const creator = await Creator.findById(content.creatorId);
    if (!creator?.stripeAccountId) {
      return new NextResponse(
        'This creator has not set up their payment account yet. Please try again later.',
        { status: 400 }
      );
    }

    // Calculate amounts
    const amount = Math.round(content.price * 100); // Convert to cents
    const platformFee = Math.round(amount * 0.2); // 20% platform fee

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: content.currency.toLowerCase(),
      application_fee_amount: platformFee,
      transfer_data: {
        destination: creator.stripeAccountId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        contentId: contentId,
        contentType: contentType,
        buyer: session.user.id,
        creatorId: content.creatorId.toString(),
      },
    });

    console.log('Created payment intent:', {
      id: paymentIntent.id,
      metadata: paymentIntent.metadata,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
