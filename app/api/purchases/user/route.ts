import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Purchase from '@/models/Purchase';
import Trip from '@/models/Trip';
import GoTo from '@/models/GoTo';
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

    // Find all completed purchases for this user
    const purchases = await Purchase.find({
      userId: new Types.ObjectId(session.user.id),
      status: 'completed',
    });

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
        'title description slides slideTypes price currency'
      ),
      GoTo.find({ _id: { $in: gotoIds } }).select(
        'title description slides slideTypes price currency'
      ),
    ]);

    return NextResponse.json({
      trips,
      gotos,
      purchaseCount: purchases.length,
    });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
