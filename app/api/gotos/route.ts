import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GoTo from '@/models/GoTo';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const creatorId = searchParams.get('creatorId');
    const idsParam = searchParams.get('ids');

    let filter = {};

    if (idsParam) {
      // Filter by an array of IDs
      const idsArray = idsParam.split(','); // Assuming comma-separated IDs
      filter = { _id: { $in: idsArray } };
    } else if (creatorId) {
      filter = { creatorId, status: 'launch' };
    }

    const gotos = await GoTo.find(filter)
      .select('title description slides price currency avgRating')
      .lean();

    // Convert ObjectId to string and ensure price/currency are present
    const formattedGotos = gotos.map((goto) => {
      console.log('=== DEBUG: Raw goto from DB ===', goto);
      const formatted = {
        ...goto,
        _id: goto._id.toString(),
        price: goto.price ?? 0,
        currency: goto.currency ?? 'USD',
      };
      console.log('=== DEBUG: Formatted goto ===', formatted);
      return formatted;
    });

    console.log(
      '=== DEBUG: API GoTos ===',
      formattedGotos.map((goto) => ({
        _id: goto._id,
        title: goto.title,
        price: goto.price,
        priceType: typeof goto.price,
        currency: goto.currency,
        currencyType: typeof goto.currency,
        description: goto.description,
        slides: goto.slides,
      }))
    );

    return NextResponse.json(formattedGotos, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    // Validate required fields (creatorId, title, etc.)

    // e.g. if you require creatorId:
    if (!data.creatorId) {
      return new NextResponse('creatorId is required', { status: 400 });
    }

    const newGoTo = new GoTo(data);
    await newGoTo.save();
    return NextResponse.json(newGoTo, { status: 201 });
  } catch (error: any) {
    console.error(error);

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
