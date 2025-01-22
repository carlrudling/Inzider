import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import Discount from '@/models/Discount';

export async function GET() {
  try {
    await dbConnect();
    const discounts = await Discount.find({});
    return NextResponse.json(discounts, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const newDiscount = new Discount(data);
    await newDiscount.save();
    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
