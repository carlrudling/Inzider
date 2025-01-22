import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Creator from '@/models/Creator';
import User from '@/models/User';
import dbConnect from '@/utils/database';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { email, name, type } = await req.json();
    if (!email || !type || !['creator', 'user'].includes(type)) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    await dbConnect();

    // Check if user already exists in either collection
    const existingCreator = await Creator.findOne({ email });
    const existingUser = await User.findOne({ email });

    // If they already have the requested type, return that account
    if (type === 'creator' && existingCreator) {
      return NextResponse.json({
        success: true,
        id: existingCreator._id.toString(),
      });
    }
    if (type === 'user' && existingUser) {
      return NextResponse.json({
        success: true,
        id: existingUser._id.toString(),
      });
    }

    // Generate username (handle duplicates)
    let username = email.split('@')[0];
    let counter = 1;
    while (
      (type === 'creator' && (await Creator.findOne({ username }))) ||
      (type === 'user' && (await User.findOne({ username })))
    ) {
      username = `${email.split('@')[0]}${counter}`;
      counter++;
    }

    // Create new account based on type
    if (type === 'creator') {
      const newCreator = await Creator.create({
        email,
        name,
        username,
      });
      return NextResponse.json({
        success: true,
        id: newCreator._id.toString(),
      });
    } else {
      const newUser = await User.create({
        email,
        name,
        username,
      });
      return NextResponse.json({
        success: true,
        id: newUser._id.toString(),
      });
    }
  } catch (error) {
    console.error('Error in google-type route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
