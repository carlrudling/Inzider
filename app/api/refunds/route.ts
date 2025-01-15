declare const process: {
  env: {
    STRIPE_SECRET_KEY: string;
  };
};

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/utils/database';
import Purchase from '@/models/Purchase';
import User from '@/models/User';
import GoTo from '@/models/GoTo';
import Trip from '@/models/Trip';
import Stripe from 'stripe';
import config from '@/config';
import { Document, Model, Types } from 'mongoose';
import Refund from '@/models/Refund';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

interface IPurchase {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  contentId: Types.ObjectId;
  contentType: string;
  status: string;
  stripePaymentId: string;
  refundReason?: string;
  amount: number;
  currency: string;
  creatorId: Types.ObjectId;
  creatorAmount: number;
  platformAmount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface IContent {
  _id: Types.ObjectId;
  title: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.type !== 'creator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Received refund request body:', body);

    const { buyerEmail, contentType, contentTitle, reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'A reason for the refund is required' },
        { status: 400 }
      );
    }

    // Log the extracted values
    console.log('Extracted refund data:', {
      buyerEmail,
      contentType,
      contentTitle,
      reason,
    });

    // Find the buyer by email
    const buyer = await User.findOne({ email: buyerEmail });
    console.log(
      'Buyer details:',
      buyer
        ? {
            id: buyer._id,
            email: buyer.email,
          }
        : 'Not found'
    );
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Find the content by title and type
    const ContentModel: Model<any> =
      contentType.toLowerCase() === 'goto' ? GoTo : Trip;
    const content = await ContentModel.findOne({
      title: contentTitle,
    }).populate('creatorId');
    console.log(
      'Content details:',
      content
        ? {
            id: content._id,
            title: content.title,
            creatorId: content.creatorId,
          }
        : 'Not found'
    );
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Log the query parameters we're using to find the purchase
    const purchaseQuery = {
      userId: buyer._id,
      contentId: content._id,
      contentType: contentType.toLowerCase(),
      status: 'completed',
      stripePaymentId: { $not: /^manual_/ },
    };
    console.log('Purchase query:', purchaseQuery);

    // Find all purchases for this user to debug
    const allUserPurchases = await Purchase.find({ userId: buyer._id });
    console.log(
      'All user purchases:',
      allUserPurchases.map((p) => ({
        id: p._id,
        contentId: p.contentId,
        contentType: p.contentType,
        status: p.status,
        stripePaymentId: p.stripePaymentId,
      }))
    );

    // Find the specific purchase
    const purchase = (await Purchase.findOne(
      purchaseQuery
    ).lean()) as IPurchase | null;
    console.log('Found purchase:', purchase);

    if (!purchase) {
      return NextResponse.json(
        { error: 'No completed purchase found for this content' },
        { status: 404 }
      );
    }

    // Now check if this purchase belongs to our buyer
    console.log(
      'Comparing purchase.userId:',
      purchase.userId.toString(),
      'with buyer._id:',
      buyer._id.toString()
    );
    if (
      !purchase.userId ||
      purchase.userId.toString() !== buyer._id.toString()
    ) {
      return NextResponse.json(
        { error: 'This purchase does not belong to the specified buyer' },
        { status: 404 }
      );
    }

    // Verify the creator is the owner of the content
    const creatorId = content.creatorId?._id || content.creatorId;
    console.log(
      'Comparing content creator:',
      creatorId?.toString(),
      'with session.user.id:',
      session.user.id
    );
    if (!creatorId || creatorId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to refund this purchase' },
        { status: 403 }
      );
    }

    // Get the payment ID from the correct location
    const stripePaymentId = purchase.stripePaymentId;
    if (!stripePaymentId || stripePaymentId.startsWith('manual_')) {
      return NextResponse.json(
        { error: 'Cannot refund manual purchases' },
        { status: 400 }
      );
    }

    // Process refund through Stripe
    const stripeRefund = await stripe.refunds.create({
      payment_intent: stripePaymentId,
      reason: 'requested_by_customer',
    });

    // Update purchase status in database
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchase._id,
      {
        status: 'refunded',
        refundReason: reason,
        refundedAt: new Date(),
      },
      { new: true }
    );

    // Save refund record
    const refund = new Refund({
      purchaseId: purchase._id,
      buyer: buyer._id,
      contentId: content._id,
      contentType: contentType.toLowerCase(),
      creatorId: session.user.id,
      amount: purchase.amount,
      currency: purchase.currency,
      reason: reason || 'No reason provided',
      stripeRefundId: stripeRefund.id,
      status: 'completed',
      processedBy: session.user.id,
    });

    // Log the refund data before saving
    console.log('Creating refund with data:', {
      purchaseId: purchase._id,
      buyerEmail: buyer.email,
      contentTitle: content.title,
      amount: purchase.amount,
      reason,
    });

    try {
      await refund.save();
    } catch (err) {
      console.error('Error saving refund:', err);
      if (
        err &&
        typeof err === 'object' &&
        'name' in err &&
        err.name === 'ValidationError' &&
        'errors' in err
      ) {
        const validationError = err as {
          errors: { [key: string]: { message: string } };
        };
        return NextResponse.json(
          {
            error:
              'Invalid refund data: ' +
              Object.values(validationError.errors)
                .map((e) => e.message)
                .join(', '),
          },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json({ message: 'Refund processed successfully' });
  } catch (err) {
    console.error('Refund error:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to process refund';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.type !== 'creator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all refunds for this creator
    const refunds = await Refund.find({ creatorId: session.user.id })
      .populate('buyer', 'email')
      .sort({ createdAt: -1 })
      .lean();

    // Format the refunds for the response
    const formattedRefunds = await Promise.all(
      refunds.map(async (refund) => {
        let contentTitle = 'Content not found';

        try {
          // Use mongoose's model() function to get the model dynamically
          const modelName = refund.contentType === 'goto' ? 'GoTo' : 'Trip';
          const doc = await mongoose
            .model(modelName)
            .findById(refund.contentId, 'title')
            .lean();
          if (doc && 'title' in doc) {
            contentTitle = doc.title;
          }
        } catch (err) {
          console.error('Error fetching content:', err);
        }

        return {
          id: refund._id,
          buyerEmail: refund.buyer.email,
          contentTitle,
          contentType: refund.contentType,
          amount: refund.amount,
          currency: refund.currency,
          reason: refund.reason,
          refundedAt: refund.createdAt,
        };
      })
    );

    return NextResponse.json(formattedRefunds);
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}
