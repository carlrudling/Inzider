import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import GoTo, { IGoTo } from '@/models/GoTo';
import Trip, { ITrip } from '@/models/Trip';
import { Types, Document, Model } from 'mongoose';
import { IReview } from '@/models/Review';

type ContentModel = Model<IGoTo | ITrip>;
type ContentDocument = Document & (IGoTo | ITrip);

interface ReviewInput {
  rating: number;
  text: string;
}

export async function POST(
  request: NextRequest,
  context: { params: { contentType: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    // Get params from context
    const { contentType: rawContentType, id } = context.params;
    // Remove the 's' from the content type if it exists
    const contentType = rawContentType.toLowerCase().replace(/s$/, '');
    console.log('Processing review for:', { contentType, id });

    if (!['goto', 'trip'].includes(contentType)) {
      console.log('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const { rating, text }: ReviewInput = await request.json();
    console.log('Review input:', { rating, text });
    if (!rating || !text?.trim()) {
      console.log('Missing rating or text:', { rating, text });
      return NextResponse.json(
        { error: 'Rating and review text are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.log('Invalid rating:', rating);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the model based on content type
    const Model = (contentType === 'goto' ? GoTo : Trip) as ContentModel;

    // Find the content and verify the user has purchased it
    const content = await Model.findById(id).lean();
    if (!content) {
      console.log('Content not found:', id);
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check if the user has purchased this content
    const userId = new Types.ObjectId(session.user.id);
    const buyers = content.buyers || [];
    if (!buyers.some((buyer) => buyer.toString() === userId.toString())) {
      console.log('User has not purchased content:', session.user.id);
      return NextResponse.json(
        {
          error:
            'You must purchase this content before you can leave a review.',
        },
        { status: 403 }
      );
    }

    // Check if the user has already reviewed this content
    const reviews = content.reviews || [];
    if (
      reviews.some((review) => review.userId.toString() === userId.toString())
    ) {
      console.log('User has already reviewed content:', session.user.id);
      return NextResponse.json(
        {
          error:
            'You have already reviewed this content. You can only submit one review per purchase.',
        },
        { status: 400 }
      );
    }

    // Add the review
    const newReview = {
      userId,
      userName: session.user.name || 'Anonymous',
      rating,
      text,
      createdAt: new Date(),
    };

    // Update the document with the new review
    const currentReviews = content.reviews || [];
    const currentAvgRating = content.avgRating || 0;
    const currentRatingAmount = content.ratingAmount || 0;

    const updatedContent = await Model.findByIdAndUpdate(
      id,
      {
        $push: { reviews: newReview },
        $set: {
          avgRating:
            (currentAvgRating * currentReviews.length + rating) /
            (currentReviews.length + 1),
          ratingAmount: currentRatingAmount + 1,
        },
      },
      { new: true }
    );

    if (!updatedContent) {
      console.log('Failed to update content with review');
      return NextResponse.json(
        { error: 'Failed to save your review. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Successfully added review:', newReview);
    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
