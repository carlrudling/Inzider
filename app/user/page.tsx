'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Card from '@/components/Card';
import UserNav from '@/components/UserNav';
import Loader from '@/components/Loader';

interface PurchaseData {
  trips: Array<{
    _id: string;
    title: string;
    description: string;
    slides: Array<{
      type: 'image' | 'video';
      src: string;
    }>;
    price: number;
    currency: string;
    creatorUsername: string;
    avgRating: number;
  }>;
  gotos: Array<{
    _id: string;
    title: string;
    description: string;
    slides: Array<{
      type: 'image' | 'video';
      src: string;
    }>;
    price: number;
    currency: string;
    creatorUsername: string;
    avgRating: number;
  }>;
}

export default function UserDashboard() {
  const { data: session } = useSession();

  const { data: purchases, isLoading } = useQuery<PurchaseData>({
    queryKey: ['purchases'],
    queryFn: async () => {
      console.log('Fetching purchases...');
      const res = await fetch('/api/purchases/user');
      if (!res.ok) {
        console.error('Failed to fetch purchases:', await res.text());
        throw new Error('Failed to fetch purchases');
      }
      const data = await res.json();
      console.log('Received purchases data:', data);
      return data;
    },
  });

  if (!session) {
    return <div>Please sign in to view your purchases.</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  console.log('Rendering with purchases:', purchases);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold my-10">My Purchases</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Trips</h2>
            {!purchases?.trips || purchases.trips.length === 0 ? (
              <p className="text-gray-500">
                You haven't purchased any trips yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.trips.map((trip) => (
                  <Card
                    key={trip._id}
                    title={trip.title}
                    description={trip.description}
                    imageUrl={trip.slides?.[0]?.src}
                    price={trip.price}
                    currency={trip.currency}
                    navigateTo={`/${trip.creatorUsername}/trips/${trip._id}`}
                    mediaType={trip.slides?.[0]?.type || 'image'}
                    stars={trip.avgRating}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">My GoTos</h2>
            {!purchases?.gotos || purchases.gotos.length === 0 ? (
              <p className="text-gray-500">
                You haven't purchased any GoTos yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.gotos.map((goto) => (
                  <Card
                    key={goto._id}
                    title={goto.title}
                    description={goto.description}
                    imageUrl={goto.slides?.[0]?.src}
                    price={goto.price}
                    currency={goto.currency}
                    navigateTo={`/${goto.creatorUsername}/gotos/${goto._id}`}
                    mediaType={goto.slides?.[0]?.type || 'image'}
                    stars={goto.avgRating}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
