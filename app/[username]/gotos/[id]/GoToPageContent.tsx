'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AboutPageComponent from '@/components/AboutPageComponent';
import GoToPageComponent from '@/components/GoToPage';

interface GoToPageContentProps {
  initialData: any;
  username: string;
  id: string;
}

export default function GoToPageContent({
  initialData,
  username,
  id,
}: GoToPageContentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = useSession();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/purchases/user');
        if (!res.ok) throw new Error('Failed to fetch purchases');

        const data = await res.json();
        const purchased = data.gotos.some((goto: any) => goto._id === id);
        setHasPurchased(purchased);
      } catch (error) {
        console.error('Error checking purchase:', error);
      }

      setLoading(false);
    };

    checkPurchase();
  }, [session, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showDetails) {
    return (
      <div className="min-h-screen bg-white">
        {initialData.spots.map((spot: any, index: number) => (
          <GoToPageComponent
            key={index}
            title={spot.title}
            subtitle={initialData.title}
            slides={spot.slides || []}
            address={spot.location}
            creatorWords={spot.description}
            specifics={spot.specifics || []}
            pageNumber={`${index + 1}`}
            totalPages={`${initialData.spots.length}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AboutPageComponent
        title={initialData.title}
        price={initialData.price.toString()}
        currency={initialData.currency}
        slides={initialData.slides || []}
        specifics={initialData.specifics}
        creatorWords={initialData.description || ''}
        reviewCount={initialData.reviewCount}
        averageRating={initialData.averageRating}
        purchaseCount={initialData.purchaseCount}
        status="launch"
        contentType="goto"
        id={id}
        username={username}
        onGetItClick={() => setShowDetails(true)}
        hasPurchased={hasPurchased}
      />
    </div>
  );
}
