'use client';
import { useState } from 'react';
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
      />
    </div>
  );
}
