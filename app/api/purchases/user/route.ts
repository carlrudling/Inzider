import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Purchase, { IPurchase } from '@/models/Purchase';
import Trip, { ITrip } from '@/models/Trip';
import GoTo, { IGoTo } from '@/models/GoTo';
import { Types } from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.error('No session found');
      return new NextResponse('Unauthorized - No session', { status: 401 });
    }

    if (!session.user) {
      console.error('No user in session');
      return new NextResponse('Unauthorized - No user', { status: 401 });
    }

    if (!session.user.id) {
      console.error('No user ID in session');
      return new NextResponse('Unauthorized - No user ID', { status: 401 });
    }

    await dbConnect();

    // Find all completed purchases for this user and populate creator data
    const purchases = await Purchase.find({
      userId: new Types.ObjectId(session.user.id),
      status: 'completed',
    }).populate({
      path: 'creatorId',
      model: 'Creator',
      select: 'username',
    });

    console.log(
      'Purchases with creator data:',
      purchases.map((p) => ({
        contentId: p.contentId,
        creatorId: p.creatorId,
        creatorUsername: p.creatorId?.username,
      }))
    );

    // Separate trip and goto IDs
    const tripIds = purchases
      .filter((p) => p.contentType === 'trip')
      .map((p) => p.contentId);

    const gotoIds = purchases
      .filter((p) => p.contentType === 'goto')
      .map((p) => p.contentId);

    // Fetch the actual content
    const [trips, gotos] = await Promise.all([
      Trip.find({ _id: { $in: tripIds } }).select(
        'title description slides price currency'
      ) as Promise<ITrip[]>,
      GoTo.find({ _id: { $in: gotoIds } }).select(
        'title description slides price currency'
      ) as Promise<IGoTo[]>,
    ]);

    // Map purchases to content to include purchase dates and creator usernames
    const tripsWithPurchaseInfo = (
      trips as (ITrip & { _id: Types.ObjectId })[]
    ).map((trip) => {
      const purchase = purchases.find(
        (p) => p.contentId.toString() === trip._id.toString()
      );
      const creator = purchase?.creatorId as any; // Using any to bypass TypeScript error
      return {
        ...trip.toObject(),
        purchaseDate: purchase?.createdAt,
        creatorUsername: creator?.username || 'unknown',
      };
    });

    const gotosWithPurchaseInfo = (
      gotos as (IGoTo & { _id: Types.ObjectId })[]
    ).map((goto) => {
      const purchase = purchases.find(
        (p) => p.contentId.toString() === goto._id.toString()
      );
      const creator = purchase?.creatorId as any; // Using any to bypass TypeScript error
      return {
        ...goto.toObject(),
        purchaseDate: purchase?.createdAt,
        creatorUsername: creator?.username || 'unknown',
      };
    });

    return NextResponse.json({
      trips: tripsWithPurchaseInfo,
      gotos: gotosWithPurchaseInfo,
      purchaseCount: purchases.length,
    });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
