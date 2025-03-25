import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  try {
    await dbConnect();
    const creator = await Creator.findOne({ email: resolvedParams.email });

    if (!creator) {
      return new NextResponse('Creator not found', { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
