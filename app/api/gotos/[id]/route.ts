import { NextResponse } from 'next/server';
import dbConnect from '@/utils/database';
import GoTo from '@/models/GoTo';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const gotoDoc = await GoTo.findById(params.id);
    if (!gotoDoc) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(gotoDoc, { status: 200 });
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
    console.log('Connecting to database...');
    await dbConnect();

    const data = await req.json();
    console.log('Received data:', data);

    const existingGoTo = await GoTo.findById(params.id);
    if (!existingGoTo) {
      console.error('GoTo not found with ID:', params.id);
      return new NextResponse('Not Found', { status: 404 });
    }

    console.log('Existing GoTo found:', existingGoTo);

    const existingSlides = existingGoTo.slides || [];
    const updatedSlides = data.slides || [];

    console.log('Existing slides:', existingSlides);
    console.log('Updated slides:', updatedSlides);

    // Validate slides format
    const validSlides = updatedSlides.every(
      (slide: { src: string; type: string }) =>
        slide.src && slide.type && typeof slide.src === 'string'
    );

    if (!validSlides) {
      console.error('Invalid slide format detected:', updatedSlides);
      return new NextResponse('Invalid Slide Format', { status: 400 });
    }

    // Identify removed slides
    const removedSlides = existingSlides.filter(
      (existingSlide: any) =>
        !updatedSlides.some(
          (updatedSlide: any) => updatedSlide.src === existingSlide.src
        )
    );
    console.log('Slides to remove:', removedSlides);

    // Delete removed slides from R2
    for (const slide of removedSlides) {
      if (slide.src) {
        const key = new URL(slide.src).pathname.slice(1); // Extract the key
        console.log('Deleting slide from R2 with key:', key);
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/delete`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
          }
        );
      }
    }

    // Update the GoTo document
    console.log('Updating GoTo...');
    const updatedGoTo = await GoTo.findByIdAndUpdate(
      params.id,
      {
        ...data,
        slides: updatedSlides, // Replace slides with updated ones
      },
      { new: true, runValidators: true }
    );

    console.log('Updated GoTo:', updatedGoTo);
    return NextResponse.json(updatedGoTo, { status: 200 });
  } catch (error: any) {
    console.error('Error during PUT request:', error);

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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    console.error('Missing GoTo ID');
    return new NextResponse('Missing GoTo ID', { status: 400 });
  }
  try {
    await dbConnect();
    const deletedGoTo = await GoTo.findByIdAndDelete(params.id);
    if (!deletedGoTo) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(
      { message: 'GoTo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
