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

    // Format the main slides
    const formattedSlides = data.slides?.map((slide: any) => {
      if (typeof slide === 'string') {
        // If it's a string URL, check if it ends with common video extensions
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(slide);
        return {
          type: isVideo ? 'video' : 'image',
          src: slide,
        };
      }
      // If it's an object, use its type or detect from src if type is missing
      return {
        type:
          slide.type ||
          (/\.(mp4|webm|ogg|mov)$/i.test(slide.src) ? 'video' : 'image'),
        src: slide.src,
      };
    });

    // Format the days data according to the schema
    const formattedDays = data.days?.map((day: any) => ({
      date: new Date(day.date),
      spots: day.spots?.map((spot: any) => ({
        title: spot.title,
        location: spot.location,
        description: spot.description,
        specifics: spot.specifics?.map((specific: any) => ({
          label: specific.label,
          value: specific.value,
        })),
        slides: spot.slides?.map((slide: any) => {
          if (typeof slide === 'string') {
            // If it's a string URL, check if it ends with common video extensions
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(slide);
            return {
              type: isVideo ? 'video' : 'image',
              src: slide,
            };
          }
          // If it's an object, use its type or detect from src if type is missing
          return {
            type:
              slide.type ||
              (/\.(mp4|webm|ogg|mov)$/i.test(slide.src) ? 'video' : 'image'),
            src: slide.src,
          };
        }),
      })),
    }));

    // Format the specifics
    const formattedSpecifics = data.specifics?.map((specific: any) => ({
      label: specific.label,
      value: specific.value,
    }));

    // Update the Trip document with formatted data
    console.log('Updating Trip...');
    const updatedTrip = await Trip.findByIdAndUpdate(
      params.id,
      {
        ...data,
        days: formattedDays,
        slides: formattedSlides,
        specifics: formattedSpecifics,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      { new: true, runValidators: true }
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
