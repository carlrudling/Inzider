'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDetails = searchParams.get('view') === 'content';
  const { data: session, status: sessionStatus } = useSession();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchase = async () => {
      if (sessionStatus === 'loading') return;

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
  }, [session, id, sessionStatus]);

  const handlePaymentSuccess = () => {
    console.log('Payment successful, showing details');
    router.push(`/${username}/gotos/${id}?view=content`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="max-w-[460px] mx-auto pt-6 px-4">
          {/* Title and price skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Image carousel skeleton */}
          <div className="w-full h-[300px] bg-gray-200 rounded-lg mb-4"></div>

          {/* Content sections skeleton */}
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showDetails) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[460px] mx-auto">
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
        onGetItClick={() => {
          if (hasPurchased) {
            console.log('Already purchased, showing details');
            router.push(`/${username}/gotos/${id}?view=content`);
          } else {
            console.log('Not purchased, waiting for payment');
            // Don't set showDetails here, wait for successful payment
          }
        }}
        hasPurchased={hasPurchased}
        spots={initialData.spots || []}
        isLoading={loading}
        reviews={initialData.reviews || []}
      />
    </div>
  );
}
