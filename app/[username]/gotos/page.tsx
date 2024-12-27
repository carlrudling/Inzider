import { notFound } from 'next/navigation';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';
import GoTo from '@/models/GoTo';
import GoToCard from '@/components/Card';

async function getCreatorAndGotos(username: string) {
  await dbConnect();
  const creator = await Creator.findOne({ username });

  if (!creator) {
    return null;
  }

  const gotos = await GoTo.find({
    creatorId: creator._id,
    status: 'launch',
  }).sort({ createdAt: -1 });

  return {
    creator,
    gotos,
    backgroundImage: creator.backgroundImage,
  };
}

export default async function CreatorGotosPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const data = await getCreatorAndGotos(username);

  if (!data) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
          data.backgroundImage || '/default-background.jpg'
        })`,
      }}
    >
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-poppins italic text-white text-center mb-8">
          My Go-tos
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {data.gotos.map((goto: any) => (
            <GoToCard
              key={goto._id}
              title={goto.title}
              description={goto.description}
              imageUrl={goto.slides[0]?.src || '/default-image.jpg'}
              country={goto.location || 'Unknown'}
              tag="Launched"
              stars={goto.avgRating || 0}
              navigateTo={`/${username}/goto/${goto._id}`}
            />
          ))}
        </div>

        {data.gotos.length === 0 && (
          <div className="text-center text-white py-20">
            <h2 className="text-2xl font-semibold">No Go-tos available yet</h2>
            <p className="mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
