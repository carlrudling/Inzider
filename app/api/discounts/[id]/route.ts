import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Discount from '@/models/Discount';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const discount = await Discount.findById(params.id);
    if (!discount) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(discount, { status: 200 });
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
    const updatedDiscount = await Discount.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!updatedDiscount) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(updatedDiscount, { status: 200 });
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
    const deletedDiscount = await Discount.findByIdAndDelete(params.id);
    if (!deletedDiscount) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(
      { message: 'Discount deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
