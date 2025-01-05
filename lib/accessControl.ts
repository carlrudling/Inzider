import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Purchase from '@/models/Purchase';
import Trip from '@/models/Trip';
import GoTo from '@/models/GoTo';
import { redirect } from 'next/navigation';
import { Types } from 'mongoose';

export async function verifyAccess(
  contentId: string,
  contentType: 'trip' | 'goto'
) {
  // Get the current session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  try {
    // Check if there's a completed purchase for this content
    const purchase = await Purchase.findOne({
      contentId: new Types.ObjectId(contentId),
      contentType,
      status: 'completed',
      userId: new Types.ObjectId(session.user.id),
    });

    if (!purchase) {
      // If no purchase found, check if it's the creator's content
      if (contentType === 'trip') {
        const trip = await Trip.findOne({ _id: new Types.ObjectId(contentId) });
        if (!trip || trip.creatorId.toString() !== session.user.id) {
          return false;
        }
      } else {
        const goto = await GoTo.findOne({ _id: new Types.ObjectId(contentId) });
        if (!goto || goto.creatorId.toString() !== session.user.id) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error verifying access:', error);
    return false;
  }
}

export async function requireAccess(
  contentId: string,
  contentType: 'trip' | 'goto'
) {
  const hasAccess = await verifyAccess(contentId, contentType);

  if (!hasAccess) {
    redirect(`/${contentType}s/${contentId}/preview`);
  }
}
