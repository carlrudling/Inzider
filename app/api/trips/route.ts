import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Trip from '@/models/Trip';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const creatorId = searchParams.get('creatorId');
    const idsParam = searchParams.get('ids');

    let filter = {};

    if (idsParam) {
      // Filter by an array of IDs
      const idsArray = idsParam.split(',');
      filter = { _id: { $in: idsArray } };
    } else if (creatorId) {
      filter = { creatorId };
    }

    const trips = await Trip.find(filter);
    return NextResponse.json(trips, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();
    console.log('Received Data:', data); // Add this to inspect the request body

    // Validate the required fields
    const requiredFields = [
      'title',
      'price',
      'currency',
      'creatorId',
      'startDate',
      'endDate',
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const newTrip = new Trip(data);
    await newTrip.save();

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error: any) {
    console.error('Error creating trip:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
