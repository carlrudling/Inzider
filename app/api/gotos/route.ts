import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import GoTo from '@/models/GoTo';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const creatorId = searchParams.get('creatorId');
    const idsParam = searchParams.get('ids');

    let filter = {};

    if (idsParam) {
      // Filter by an array of IDs
      const idsArray = idsParam.split(','); // Assuming comma-separated IDs
      filter = { _id: { $in: idsArray } };
    } else if (creatorId) {
      filter = { creatorId };
    }

    const gotos = await GoTo.find(filter);
    return NextResponse.json(gotos, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    // Validate required fields (creatorId, title, etc.)

    // e.g. if you require creatorId:
    if (!data.creatorId) {
      return new NextResponse('creatorId is required', { status: 400 });
    }

    const newGoTo = new GoTo(data);
    await newGoTo.save();
    return NextResponse.json(newGoTo, { status: 201 });
  } catch (error: any) {
    console.error(error);

    // Check for duplicate key error (code 11000)
    if (error.code === 11000) {
      return new NextResponse(
        'You already have a GoTo with this title. Please choose a different title.',
        { status: 409 }
      );
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
