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

  // Then find the specific GoTo
  const goto = await GoTo.findById(gotoId).lean();
  if (!goto) {
    return null;
  }

  // Verify this GoTo belongs to this creator
  if (goto.creatorId.toString() !== creator._id.toString()) {
    return null;
  }

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

export default async function GoToPage({
  params,
}: {
  params: { username: string; id: string };
}) {
  const data = await getGoToData(params.username, params.id);

  if (!data) {
    notFound();
  }

  return (
    <GoToPageContent
      initialData={data}
      username={params.username}
      id={params.id}
    />
  );
}
