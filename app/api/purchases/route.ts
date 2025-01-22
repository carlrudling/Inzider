import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Purchase from '@/models/Purchase';
import GoTo from '@/models/GoTo';
import Trip from '@/models/Trip';
import { Types } from 'mongoose';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    console.log('Purchase request received');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { contentId, contentType, stripePaymentId } = await req.json();
    console.log('Request body:', { contentId, contentType, stripePaymentId });

    if (!contentId || !contentType || !stripePaymentId) {
      console.log('Missing required fields');
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await dbConnect();
    console.log('Connected to database');

    // Verify the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentId);
    console.log('Payment intent details:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

    if (paymentIntent.status !== 'succeeded') {
      console.log('Payment not successful');
      return new NextResponse('Payment not successful', { status: 400 });
    }

    // Verify the payment details match
    const metadata = paymentIntent.metadata as {
      contentId: string;
      contentType: string;
      buyer: string;
    };

    if (
      metadata.contentId !== contentId ||
      metadata.contentType !== contentType ||
      metadata.buyer !== session.user.id
    ) {
      console.log('Payment details mismatch');
      return new NextResponse('Payment verification failed', { status: 400 });
    }

    // Find the content
    const Model = contentType === 'trip' ? Trip : GoTo;
    const content = await Model.findById(contentId);
    console.log('Found content:', content);

    if (!content) {
      console.log('Content not found');
      return new NextResponse('Content not found', { status: 404 });
    }

    // Check if there's an existing purchase that's not refunded
    const existingPurchase = await Purchase.findOne({
      buyer: new Types.ObjectId(session.user.id),
      contentId: new Types.ObjectId(contentId),
      contentType,
      status: { $ne: 'refunded' },
    });

    if (existingPurchase) {
      console.log('Active purchase already exists');
      return new NextResponse(
        'You already have an active purchase for this content',
        {
          status: 400,
        }
      );
    }

    // Create the purchase record
    const purchase = new Purchase({
      buyer: new Types.ObjectId(session.user.id),
      contentId: new Types.ObjectId(contentId),
      contentType,
      amount: content.price,
      currency: content.currency,
      creatorId: content.creatorId,
      creatorAmount: content.price * 0.8, // 80% to creator
      platformAmount: content.price * 0.2, // 20% to platform
      stripePaymentId,
      status: 'pending',
    });
    console.log('Created purchase object:', purchase);

    await purchase.save();
    console.log('Saved purchase');

    // Add user to the buyers array of the content
    if (contentType === 'trip') {
      await Trip.findByIdAndUpdate(
        contentId,
        {
          $addToSet: { buyers: session.user.id },
        },
        { new: true }
      );
    } else {
      await GoTo.findByIdAndUpdate(
        contentId,
        {
          $addToSet: { buyers: session.user.id },
        },
        { new: true }
      );
    }
    console.log('Updated content buyers array');

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
