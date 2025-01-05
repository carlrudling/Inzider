import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    await dbConnect();
    const creator = await Creator.findOne({ email: params.email });

    if (!creator) {
      return new NextResponse('Creator not found', { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error('Error fetching creator by email:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
