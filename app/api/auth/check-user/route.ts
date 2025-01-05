import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
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

    if (creator) {
      return NextResponse.json({ exists: true, type: 'creator' });
    }

    if (user) {
      return NextResponse.json({ exists: true, type: 'user' });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
