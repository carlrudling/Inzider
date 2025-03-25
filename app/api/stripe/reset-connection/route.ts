import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const creator = await Creator.findOneAndUpdate(
      { email: session.user.email },
      { $unset: { stripeAccountId: 1 } },
      { new: true }
    );

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting Stripe connection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
