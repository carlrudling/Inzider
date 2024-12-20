import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Trip from '@/models/Trip';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (!trip) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(trip, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await req.json();
    const updatedTrip = await Trip.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!updatedTrip) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const deletedTrip = await Trip.findByIdAndDelete(params.id);
    if (!deletedTrip) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(
      { message: 'Trip deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
