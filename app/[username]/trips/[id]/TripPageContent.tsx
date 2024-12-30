'use client';
import { useState } from 'react';
import AboutPageComponent from '@/components/AboutPageComponent';
import TripDayPage from '@/components/TripDayPage';

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
        onGetItClick={() => setShowDetails(true)}
      />
    </div>
  );
}
