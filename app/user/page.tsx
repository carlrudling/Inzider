'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Card from '@/components/Card';
import UserNav from '@/components/UserNav';
import Loader from '@/components/Loader';

interface Trip {
  _id: string;
  title: string;
  coverImage: string;
  description: string;
  country: string;
  tag: string;
  rating: number;
}

interface GoTo {
  _id: string;
  title: string;
  coverImage: string;
  description: string;
  country: string;
  tag: string;
  rating: number;
}

interface PurchaseData {
  trips: Trip[];
  gotos: GoTo[];
}

export default function UserDashboard() {
  const { data: session } = useSession();

  const { data: purchases, isLoading } = useQuery<PurchaseData>({
    queryKey: ['purchases'],
    queryFn: async () => {
      const res = await fetch('/api/purchases/user');
      if (!res.ok) throw new Error('Failed to fetch purchases');
      return res.json();
    },
  });

  if (!session) {
    return <div>Please sign in to view your purchases.</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold my-10">My Purchases</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases?.trips?.map((trip) => (
                <Card
                  key={trip._id}
                  title={trip.title}
                  description={trip.description}
                  imageUrl={trip.coverImage}
                  country={trip.country}
                  tag={trip.tag}
                  stars={trip.rating}
                  navigateTo={`/trips/${trip._id}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">My GoTos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases?.gotos?.map((goto) => (
                <Card
                  key={goto._id}
                  title={goto.title}
                  description={goto.description}
                  imageUrl={goto.coverImage}
                  country={goto.country}
                  tag={goto.tag}
                  stars={goto.rating}
                  navigateTo={`/gotos/${goto._id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
