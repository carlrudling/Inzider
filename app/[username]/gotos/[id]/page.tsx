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

  return {
    title: goto.title,
    price: goto.price,
    currency: goto.currency,
    description: goto.description,
    slides: goto.slides,
    specifics: goto.specifics || [],
    reviewCount: goto.reviews?.length || 0,
    averageRating: goto.avgRating || 0,
    purchaseCount: goto.buyers?.length || 0,
    spots: goto.spots || [],
  };
}

export default async function GoToPage({
  params: { username, id },
}: {
  params: { username: string; id: string };
}) {
  const data = await getGoToData(username, id);

  if (!data) {
    notFound();
  }

  return <GoToPageContent initialData={data} username={username} id={id} />;
}
