import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const user = await User.findById(params.id);
    if (!user) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
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

    // If password updated, hash it again:
    // if (data.password) data.password = await bcrypt.hash(data.password, 10);

    const updatedUser = await User.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!updatedUser) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
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
    const deletedUser = await User.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
