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

    // Map old fields to new fields if new ones aren't set
    creator.buttonColor = creator.buttonColor || creator.tripButtonColor;
    creator.buttonTextColor = creator.buttonTextColor || creator.tripButtonText;

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

    const updatedCreator = await Creator.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: data.name,
          description: data.description,
          instagram: data.instagramLink,
          xLink: data.xLink,
          tiktok: data.tiktokLink,
          youtube: data.youtubeLink,
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
