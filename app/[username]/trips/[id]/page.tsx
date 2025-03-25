import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/Trip';
import Creator from '@/models/Creator';
import TripPageContent from './TripPageContent';

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

  // Convert MongoDB objects to plain objects
  const days =
    trip.days?.map((day: any) => ({
      date: day.date.toISOString(),
      spots:
        day.spots?.map((spot: any) => ({
          title: spot.title,
          location: spot.location,
          description: spot.description,
          specifics:
            spot.specifics?.map((specific: any) => ({
              label: specific.label,
              value: specific.value,
            })) || [],
          slides:
            spot.slides?.map((slide: any) =>
              typeof slide === 'string'
                ? { type: 'image', src: slide }
                : { type: slide.type || 'image', src: slide.src }
            ) || [],
        })) || [],
      id: day._id.toString(),
    })) || [];

  // Convert main trip slides
  const slides =
    trip.slides?.map((slide: any) => ({
      type: slide.type || 'image',
      src: slide.src,
    })) || [];

  return {
    title: trip.title,
    price: trip.price,
    currency: trip.currency,
    description: trip.description,
    slides,
    specifics: trip.specifics || [],
    reviewCount: trip.reviews?.length || 0,
    averageRating: trip.avgRating || 0,
    purchaseCount: trip.buyers?.length || 0,
    days,
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

  return <TripPageContent initialData={data} username={username} id={id} />;
}
