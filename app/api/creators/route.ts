import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';

export async function GET() {
  try {
    await dbConnect();
    const creators = await Creator.find({});
    return NextResponse.json(creators, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // If you need password hashing:
    // data.password = await bcrypt.hash(data.password, 10);

    const newCreator = new Creator(data);
    await newCreator.save();
    return NextResponse.json(newCreator, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
