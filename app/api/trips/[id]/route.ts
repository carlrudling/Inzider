import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import Purchase from '@/models/Purchase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const trip = await Trip.findById(params.id);
    if (!trip) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
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

    // Check if another trip with the same title exists for this creator
    if (data.title !== existingTrip.title) {
      const duplicateTrip = await Trip.findOne({
        _id: { $ne: params.id },
        creatorId: existingTrip.creatorId,
        title: data.title,
      });

      if (duplicateTrip) {
        return new NextResponse(
          'You already have a trip with this title. Please choose a different title.',
          { status: 409 }
        );
      }
    }

    console.log('Existing Trip found:', existingTrip);

    // Format the main slides
    const formattedSlides = data.slides?.map((slide: any) => {
      if (typeof slide === 'string') {
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(slide);
        return {
          type: isVideo ? 'video' : 'image',
          src: slide,
        };
      }
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
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(slide);
            return {
              type: isVideo ? 'video' : 'image',
              src: slide,
            };
          }
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
    if (error.code === 11000) {
      return new NextResponse(
        'You already have a trip with this title. Please choose a different title.',
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
    console.error('Missing Trip ID');
    return new NextResponse('Missing Trip ID', { status: 400 });
  }
  try {
    await dbConnect();

    // Check if there are any completed or pending purchases for this trip
    const existingPurchases = await Purchase.findOne({
      contentId: params.id,
      contentType: 'trip',
      status: { $in: ['completed', 'pending'] },
    });

    if (existingPurchases) {
      return new NextResponse(
        'Cannot delete this trip as it has been purchased by users. Consider updating its content instead.',
        { status: 403 }
      );
    }

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
