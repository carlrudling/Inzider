import { notFound } from 'next/navigation';
import dbConnect from '@/utils/database';
import Trip from '@/models/Trip';
import Creator from '@/models/Creator';
import AboutPageComponent from '@/components/AboutPageComponent';

async function getTripData(username: string, tripId: string) {
  await dbConnect();

  // First find the creator to validate the username
  const creator = await Creator.findOne({ username }).lean();
  if (!creator || !creator._id) {
    return null;
  }

  // Then find the specific Trip
  const trip = await Trip.findById(tripId).lean();
  if (!trip) {
    return null;
  }

  // Verify this Trip belongs to this creator
  if (trip.creatorId.toString() !== creator._id.toString()) {
    return null;
  }

  return {
    title: trip.title,
    price: trip.price,
    currency: trip.currency,
    description: trip.description,
    slides: trip.slides,
    specifics: trip.specifics || [],
    reviewCount: trip.reviews?.length || 0,
    averageRating: trip.avgRating || 0,
    purchaseCount: trip.buyers?.length || 0,
  };
}

export default async function TripPage({
  params: { username, id },
}: {
  params: { username: string; id: string };
}) {
  const data = await getTripData(username, id);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <AboutPageComponent
        title={data.title}
        price={data.price.toString()}
        currency={data.currency}
        slides={data.slides || []}
        specifics={data.specifics}
        creatorWords={data.description || ''}
        reviewCount={data.reviewCount}
        averageRating={data.averageRating}
        purchaseCount={data.purchaseCount}
      />
    </div>
  );
}
