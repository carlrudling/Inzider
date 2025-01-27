import { notFound } from 'next/navigation';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';
import Trip from '@/models/Trip';
import Card from '@/components/Card';

async function getCreatorAndTrips(username: string) {
  await dbConnect();
  const creator = await Creator.findOne({ username });

  if (!creator) {
    return null;
  }

  const trips = await Trip.find({
    creatorId: creator._id,
    status: 'launch',
  })
    .select('title description slides price currency avgRating')
    .sort({ createdAt: -1 });

  return {
    creator,
    trips,
    backgroundImage: creator.backgroundImage,
  };
}

export default async function CreatorTripsPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const data = await getCreatorAndTrips(username);

  if (!data) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
          data.backgroundImage || '/default-background.jpg'
        })`,
      }}
    >
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-satoshi italic text-white text-center mb-8">
          My Trips
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {data.trips.map((trip: any) => {
            const firstSlide = trip.slides[0];
            return (
              <Card
                key={trip._id}
                title={trip.title}
                description={trip.description}
                imageUrl={firstSlide?.src || '/default-image.jpg'}
                stars={trip.avgRating || 0}
                price={trip.price}
                currency={trip.currency}
                navigateTo={`/${username}/trips/${trip._id}`}
                mediaType={firstSlide?.type || 'image'}
              />
            );
          })}
        </div>

        {data.trips.length === 0 && (
          <div className="text-center text-white py-20">
            <h2 className="text-2xl font-semibold">No Trips available yet</h2>
            <p className="mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
