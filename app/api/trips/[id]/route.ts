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
    console.log('Connecting to database...');
    await dbConnect();

    const data = await req.json();
    console.log('Received data:', data);

    const existingTrip = await Trip.findById(params.id);
    if (!existingTrip) {
      console.error('Trip not found with ID:', params.id);
      return new NextResponse('Not Found', { status: 404 });
    }

    console.log('Existing Trip found:', existingTrip);

    // Handle slides for both main trip and spots
    const existingSlides = existingTrip.slides || [];
    const updatedSlides = data.slides || [];

    console.log('Existing slides:', existingSlides);
    console.log('Updated slides:', updatedSlides);

    // Validate slides format
    const validSlides = updatedSlides.every((slide: any) => {
      if (typeof slide === 'string') {
        // Handle string URLs (new uploads)
        return true;
      }
      // Handle existing slide objects
      return slide.src && slide.type && typeof slide.src === 'string';
    });

    if (!validSlides) {
      console.error('Invalid slide format detected:', updatedSlides);
      return new NextResponse('Invalid Slide Format', { status: 400 });
    }

    // Handle removed slides
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
        const key = new URL(slide.src).pathname.slice(1);
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

    // Update the Trip document
    console.log('Updating Trip...');
    const updatedTrip = await Trip.findByIdAndUpdate(
      params.id,
      {
        ...data,
        slides: updatedSlides.map((slide: any) => {
          if (typeof slide === 'string') {
            // Convert string URLs to proper slide objects
            return {
              src: slide,
              type: slide.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
            };
          }
          return slide;
        }),
      },
      { new: true }
    );

    console.log('Updated Trip:', updatedTrip);
    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error: any) {
    console.error('Error during PUT request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    console.error('Missing Trip ID');
    return new NextResponse('Missing Trip ID', { status: 400 });
  }
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
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
