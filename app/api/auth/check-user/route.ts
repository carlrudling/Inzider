import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    await dbConnect();

    // Check both collections
    const creator = await Creator.findOne({ email });
    const user = await User.findOne({ email });

    // If both accounts exist
    if (creator && user) {
      return NextResponse.json({
        exists: true,
        type: 'user', // Default to user, will be changed in check-type
        hasMultipleAccounts: true,
      });
    }

    // Single account
    if (creator) {
      return NextResponse.json({
        exists: true,
        type: 'creator',
        hasMultipleAccounts: false,
      });
    }

    if (user) {
      return NextResponse.json({
        exists: true,
        type: 'user',
        hasMultipleAccounts: false,
      });
    }

    return NextResponse.json({ exists: false, hasMultipleAccounts: false });
  } catch (error) {
    console.error('Error checking user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
