import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Email and type are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    let id;
    if (type === 'creator') {
      const creator = await Creator.findOne({ email });
      if (!creator) {
        return NextResponse.json(
          { error: 'Creator account not found' },
          { status: 404 }
        );
      }
      id = creator._id.toString();
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: 'User account not found' },
          { status: 404 }
        );
      }
      id = user._id.toString();
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error getting account ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
