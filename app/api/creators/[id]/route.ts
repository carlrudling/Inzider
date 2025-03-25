import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import Creator from '@/models/Creator';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    let creator;
    const { id } = params;

    // Try to find by MongoDB ID first
    if (Types.ObjectId.isValid(id)) {
      creator = await Creator.findById(id);
    }

    // If not found or invalid ID, try to find by email
    if (!creator) {
      // First try exact email match
      creator = await Creator.findOne({ email: id });

      // If still not found, try to find by username (for backward compatibility)
      if (!creator) {
        creator = await Creator.findOne({ username: id.split('@')[0] });
      }
    }

    if (!creator) {
      return new NextResponse('Creator not found', { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error('Error in creators/[id] route:', error);
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

    const updatedCreator = await Creator.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: data.name,
          username: data.username,
          description: data.description,
          instagram: data.instagram,
          xLink: data.xLink,
          tiktok: data.tiktok,
          youtube: data.youtube,
          buttonColor: data.buttonColor,
          buttonTextColor: data.buttonTextColor,
          textColor: data.textColor,
          backgroundImage: data.backgroundImage,
          profileImage: data.profileImage,
          tripButtonColor: data.buttonColor,
          tripButtonText: data.buttonTextColor,
        },
      },
      { new: true }
    );

    if (!updatedCreator) {
      return new NextResponse('Creator not found', { status: 404 });
    }

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error('Error updating creator:', error);
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
