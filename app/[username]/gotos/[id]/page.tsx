import { notFound } from 'next/navigation';
import dbConnect from '@/utils/database';
import GoTo from '@/models/GoTo';
import Creator from '@/models/Creator';
import GoToPageContent from './GoToPageContent';

async function getGoToData(username: string, gotoId: string) {
  await dbConnect();

  // First find the creator to validate the username
  const creator = await Creator.findOne({ username }).lean();
  if (!creator || !creator._id) {
    return null;
  }

  // Then find the specific GoTo with populated reviews
  const goto = await GoTo.findById(gotoId)
    .populate({
      path: 'reviews',
      select: 'rating text userName createdAt',
    })
    .lean();

  if (!goto) {
    return null;
  }

  // Verify this GoTo belongs to this creator
  if (goto.creatorId.toString() !== creator._id.toString()) {
    return null;
  }

  console.log('Found reviews:', goto.reviews); // Debug log

  // Convert MongoDB objects to plain JavaScript objects
  return {
    title: goto.title || '',
    price: goto.price || 0,
    currency: goto.currency || 'USD',
    description: goto.description || '',
    slides: (goto.slides || []).map((slide) => ({
      type: slide.type || 'image',
      src: slide.src || '',
    })),
    specifics: (goto.specifics || []).map((specific) => ({
      label: specific.label || '',
      value: specific.value || '',
    })),
    reviewCount: goto.reviews?.length || 0,
    averageRating: goto.avgRating || 0,
    purchaseCount: goto.buyers?.length || 0,
    reviews: (goto.reviews || []).map((review) => ({
      rating: review.rating,
      text: review.text,
      userName: review.userName,
    })),
    spots: (goto.spots || []).map((spot) => ({
      title: spot.title || '',
      location: spot.location || '',
      description: spot.description || '',
      specifics: (spot.specifics || []).map((specific) => ({
        label: specific.label || '',
        value: specific.value || '',
      })),
      slides: (spot.slides || []).map((slide) => ({
        type: slide.type || 'image',
        src: slide.src || '',
      })),
    })),
  };
}

interface Props {
  params: { username: string; id: string };
}

export default async function GoToPage({ params }: Props) {
  // Get the data first
  const data = await getGoToData(params.username, params.id);

  if (!data) {
    notFound();
  }

  // Pass the data to the client component
  return (
    <GoToPageContent
      initialData={data}
      username={params.username}
      id={params.id}
    />
  );
}
