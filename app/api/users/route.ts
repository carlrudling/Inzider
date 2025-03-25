import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // If password hashing is needed:
    // data.password = await bcrypt.hash(data.password, 10);

    const newUser = new User(data);
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
