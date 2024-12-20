import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const creator = await Creator.findById(params.id);
    if (!creator) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(creator, { status: 200 });
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
    // If updating password, consider hashing again

    const updatedCreator = await Creator.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!updatedCreator) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(updatedCreator, { status: 200 });
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
    const deletedCreator = await Creator.findByIdAndDelete(params.id);
    if (!deletedCreator) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(
      { message: 'Creator deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
