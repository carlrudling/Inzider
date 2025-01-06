import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Purchase from '@/models/Purchase';
import GoTo, { IGoTo } from '@/models/GoTo';
import Trip, { ITrip } from '@/models/Trip';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    console.log('Purchase request received');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { contentId, contentType } = await req.json();
    console.log('Request body:', { contentId, contentType });

    if (!contentId || !contentType) {
      console.log('Missing required fields');
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await dbConnect();
    console.log('Connected to database');

    // Find the content (Trip or GoTo)
    let content: (ITrip | IGoTo) | null = null;
    if (contentType === 'trip') {
      content = await Trip.findById(contentId).lean();
    } else {
      content = await GoTo.findById(contentId).lean();
    }
    console.log('Found content:', content);

    if (!content) {
      console.log('Content not found');
      return new NextResponse('Content not found', { status: 404 });
    }

    // Generate a unique ID for this purchase
    const uniqueId = `manual_${randomUUID()}`;

    // For now, we'll create a completed purchase without Stripe
    const purchase = new Purchase({
      userId: new Types.ObjectId(session.user.id),
      contentId: new Types.ObjectId(contentId),
      contentType,
      amount: content.price,
      currency: content.currency,
      creatorId: content.creatorId,
      creatorAmount: content.price * 0.8, // 80% to creator
      platformAmount: content.price * 0.2, // 20% to platform
      stripePaymentId: uniqueId, // Use the unique ID
      status: 'completed',
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
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
