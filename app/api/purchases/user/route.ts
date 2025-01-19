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

    // Find all purchases for this user to debug
    const allPurchases = await Purchase.find({
      buyer: new Types.ObjectId(session.user.id),
    });
    console.log(
      'All user purchases:',
      allPurchases.map((p) => ({
        id: p._id,
        contentType: p.contentType,
        status: p.status,
        refundedAt: p.refundedAt,
      }))
    );

    // Find all non-refunded purchases for this user
    const purchases = await Purchase.find({
      buyer: new Types.ObjectId(session.user.id),
      status: { $ne: 'refunded' },
    }).lean();

    console.log(
      'Filtered purchases:',
      purchases.map((p) => ({
        id: p._id,
        contentId: p.contentId,
        contentType: p.contentType,
        status: p.status,
      }))
    );

    // Separate trip and goto IDs
    const tripPurchases = purchases.filter((p) => p.contentType === 'trip');
    const gotoPurchases = purchases.filter((p) => p.contentType === 'goto');

    const tripIds = tripPurchases.map((p) => p.contentId);
    const gotoIds = gotoPurchases.map((p) => p.contentId);

    console.log(
      'Trip purchases:',
      tripPurchases.map((p) => ({
        purchaseId: p._id,
        contentId: p.contentId,
        status: p.status,
      }))
    );
    console.log(
      'GoTo purchases:',
      gotoPurchases.map((p) => ({
        purchaseId: p._id,
        contentId: p.contentId,
        status: p.status,
      }))
    );

    // Fetch the actual content
    const [trips, gotos] = await Promise.all([
      Trip.find({
        _id: { $in: tripIds },
      }).select('title description slides price currency') as Promise<ITrip[]>,
      GoTo.find({
        _id: { $in: gotoIds },
      }).select('title description slides price currency') as Promise<IGoTo[]>,
    ]);

    console.log(
      'Found trips:',
      trips.map((t) => t._id)
    );
    console.log(
      'Found gotos:',
      gotos.map((g) => g._id)
    );

    // Map purchases to content to include purchase dates
    const tripsWithPurchaseInfo = (trips as (ITrip & { _id: Types.ObjectId })[])
      .filter((trip) => {
        // Only include trips that have a non-refunded purchase
        const purchase = tripPurchases.find(
          (p) => p.contentId.toString() === trip._id.toString()
        );
        console.log('Trip filtering:', {
          tripId: trip._id,
          purchase: purchase
            ? {
                id: purchase._id,
                status: purchase.status,
                contentId: purchase.contentId,
              }
            : 'No purchase found',
        });
        return purchase && purchase.status === 'completed';
      })
      .map((trip) => {
        const purchase = tripPurchases.find(
          (p) => p.contentId.toString() === trip._id.toString()
        );
        return {
          ...trip.toObject(),
          purchaseDate: purchase?.createdAt,
          purchaseId: purchase?._id, // Adding purchase ID for tracking
          purchaseStatus: purchase?.status, // Adding status for verification
        };
      });

    const gotosWithPurchaseInfo = (gotos as (IGoTo & { _id: Types.ObjectId })[])
      .filter((goto) => {
        // Only include gotos that have a non-refunded purchase
        const purchase = gotoPurchases.find(
          (p) => p.contentId.toString() === goto._id.toString()
        );
        console.log('Goto filtering:', {
          gotoId: goto._id,
          purchase: purchase
            ? {
                id: purchase._id,
                status: purchase.status,
                contentId: purchase.contentId,
              }
            : 'No purchase found',
        });
        return purchase && purchase.status === 'completed';
      })
      .map((goto) => {
        const purchase = gotoPurchases.find(
          (p) => p.contentId.toString() === goto._id.toString()
        );
        return {
          ...goto.toObject(),
          purchaseDate: purchase?.createdAt,
          purchaseId: purchase?._id, // Adding purchase ID for tracking
          purchaseStatus: purchase?.status, // Adding status for verification
        };
      });

    console.log(
      'Final trips to return:',
      tripsWithPurchaseInfo.map((t) => ({
        id: t._id,
        purchaseId: t.purchaseId,
        purchaseStatus: t.purchaseStatus,
      }))
    );

    console.log(
      'Final gotos to return:',
      gotosWithPurchaseInfo.map((g) => ({
        id: g._id,
        purchaseId: g.purchaseId,
        purchaseStatus: g.purchaseStatus,
      }))
    );

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
