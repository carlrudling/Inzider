'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AboutPageComponent from '@/components/AboutPageComponent';
import TripDayPage from '@/components/TripDayPage';
import AccessModal from '@/components/AccessModal';
import PaymentForm from '@/components/PaymentForm';

interface TripPageContentProps {
  initialData: any;
  username: string;
  id: string;
}

export default function TripPageContent({
  initialData,
  username,
  id,
}: TripPageContentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = useSession();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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
        const purchased = data.trips.some((trip: any) => trip._id === id);
        setHasPurchased(purchased);
      } catch (error) {
        console.error('Error checking purchase:', error);
      }

      setLoading(false);
    };

    checkPurchase();
  }, [session, id]);

  const handleStartPurchase = () => {
    console.log('Starting purchase flow in TripPageContent');
    // First close the access modal
    setShowAccessModal(false);
    // Then show the payment form after a short delay
    setTimeout(() => {
      setShowPayment(true);
      console.log('Payment form shown in TripPageContent');
    }, 100);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showDetails) {
    if (!initialData.days || initialData.days.length === 0) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p>No trip details available.</p>
        </div>
      );
    }

    // Check if any day has spots
    const hasAnySpots = initialData.days.some(
      (day: any) => day.spots && day.spots.length > 0
    );
    if (!hasAnySpots) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p>No spots have been added to this trip yet.</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {initialData.days.map((day: any, index: number) => {
          if (!day.spots || day.spots.length === 0) {
            return null;
          }

          return (
            <div key={day.id || index}>
              {day.spots.map((spot: any, spotIndex: number) => (
                <TripDayPage
                  key={`${day.id}-${spotIndex}`}
                  title={spot.title || 'Untitled Spot'}
                  subtitle={initialData.title}
                  slides={spot.slides || []}
                  address={spot.location || ''}
                  creatorWords={spot.description || ''}
                  specifics={spot.specifics || []}
                  day={`Day ${index + 1} - ${new Date(
                    day.date
                  ).toLocaleDateString()}`}
                />
              ))}
            </div>
          );
        })}
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
        contentType="trip"
        id={id}
        username={username}
        onGetItClick={() => {
          if (hasPurchased) {
            console.log('Already purchased, showing details');
            setShowDetails(true);
          } else {
            setShowAccessModal(true);
          }
        }}
        hasPurchased={hasPurchased}
      />

      <AccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        packageId={id}
        packageType="Trip"
        price={initialData.price}
        currency={initialData.currency}
        onStartPurchase={handleStartPurchase}
      />

      {/* Payment Form */}
      {showPayment && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={() => setShowPayment(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-[101] flex items-center justify-center min-h-screen p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="relative">
                <PaymentForm
                  key={`payment-form-${id}`}
                  contentId={id}
                  contentType="trip"
                  onSuccess={() => {
                    setShowPayment(false);
                    setHasPurchased(true);
                    setShowDetails(true);
                  }}
                  onError={(error) => {
                    console.error('Payment error:', error);
                    setShowPayment(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
