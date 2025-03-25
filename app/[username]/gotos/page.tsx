import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Creator from '@/models/Creator';
import Card from '@/components/Card';
import GoTo from '@/models/GoTo';

async function getCreatorAndGotos(username: string) {
  await dbConnect();
  const creator = await Creator.findOne({ username });

  if (!creator) {
    return null;
  }

  // Query GoTos directly from MongoDB instead of making an API call
  const gotos = await GoTo.find({
    creatorId: creator._id,
    status: 'launch',
  })
    .select('title description slides price currency avgRating')
    .lean();

  // Format the gotos data
  const formattedGotos = gotos.map((goto) => ({
    ...goto,
    _id: goto._id.toString(),
    price: goto.price ?? 0,
    currency: goto.currency ?? 'USD',
  }));

  return {
    creator,
    gotos: formattedGotos,
    backgroundImage: creator.backgroundImage,
  };
}

interface PageProps {
  params: {
    username: string;
  };
}

export default async function CreatorGotosPage({ params }: PageProps) {
  const data = await getCreatorAndGotos(params.username);

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
        <h1 className="text-xl font-satoshi font-light text-white text-center mb-8">
          My Go-tos
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {data.gotos.map((goto: any) => {
            const firstSlide = goto.slides?.[0];
            console.log('=== DEBUG: Card props for', goto.title, {
              goto,
              firstSlide,
              price: goto.price,
              priceType: typeof goto.price,
              currency: goto.currency,
              currencyType: typeof goto.currency,
            });

            return (
              <Card
                key={goto._id}
                title={goto.title}
                description={goto.description}
                imageUrl={firstSlide?.src || '/default-image.jpg'}
                stars={goto.avgRating || 0}
                price={goto.price}
                currency={goto.currency}
                navigateTo={`/${params.username}/gotos/${goto._id}`}
                mediaType={firstSlide?.type || 'image'}
              />
            );
          })}
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
