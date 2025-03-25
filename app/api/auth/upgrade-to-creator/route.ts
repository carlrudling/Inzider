import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Creator from '@/models/Creator';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await dbConnect();

    // Check if they're already a creator
    const existingCreator = await Creator.findOne({
      email: session.user.email,
    });
    if (existingCreator) {
      return NextResponse.json({
        success: true,
        id: existingCreator._id.toString(),
      });
    }

    // Create new creator account
    const newCreator = await Creator.create({
      email: session.user.email,
      name: session.user.name,
      username: session.user.username || session.user.email?.split('@')[0],
    });

    return NextResponse.json({
      success: true,
      id: newCreator._id.toString(),
    });
  } catch (error) {
    console.error('Error upgrading to creator:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
