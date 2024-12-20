import React from 'react';
import Carousel from '@/components/Carousel';
import GoToHeader from '@/components/GoToHeader';
import LocationBlock from '@/components/LocationBlock';
import TextBlock from '@/components/TextBlock';
import DetailsBlock from '@/components/DetailsBlock';
import ReviewsList from '@/components/ReviewsList';
import CreatorNav from '@/components/CreatorNav';
import { FaStar } from 'react-icons/fa';

interface Slide {
  type: 'image' | 'video';
  src: string;
}

interface Specific {
  label: string;
  value: string | number;
}

interface GoToPageUnifiedProps {
  // Common Props
  title: string;
  subtitle?: string;
  slides: Slide[];
  creatorWords: string;
  specifics: Specific[];
  address?: string; // For LocationBlock

  // Control Props
  showHeaderType?: 'standard' | 'goto'; // 'standard' for AboutGoToPage, 'goto' for GoToPage
  showStarsAndReviews?: boolean;
  showPurchaseCount?: boolean;
  showLocationBlock?: boolean;
  showReviewsList?: boolean;
  showButtonAndLogo?: boolean;
  pageNumber?: string;
  totalPages?: string;
  price?: string;
  averageRating?: number;
  reviewCount?: number;
  purchaseCount?: number;
}

const GoToPageUnified: React.FC<GoToPageUnifiedProps> = ({
  title,
  subtitle,
  slides,
  creatorWords,
  specifics,
  address,
  showHeaderType = 'standard',
  showStarsAndReviews = false,
  showPurchaseCount = false,
  showLocationBlock = false,
  showReviewsList = false,
  showButtonAndLogo = false,
  pageNumber,
  totalPages,
  price,
  averageRating,
  reviewCount,
  purchaseCount,
}) => {
  // Render stars based on the average rating
  const renderStars = (rating: number): React.ReactNode => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < rating ? 'text-yellow-500' : 'text-gray-300'}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <section className="relative h-screen overflow-y-auto flex flex-col items-center justify-start text-white bg-cover bg-center hide-scroll">
      <div className="w-full flex justify-center">
        <div className="eqtAab w-full max-w-[580px] mx-auto">
          {showHeaderType === 'standard' && <CreatorNav />}
          <div className="flex flex-col mt-6 w-full">
            {showHeaderType === 'standard' && (
              <div className="flex flex-row justify-between items-center px-4">
                <h3 className="sm:text-lg text-base font-semibold font-poppins text-black mb-2 text-left">
                  {title}
                </h3>
                {price && (
                  <div className="bg-custom-white-blue text-custom-blue py-1 px-3 text-sm font-semibold font-poppins rounded-full">
                    {price}
                  </div>
                )}
              </div>
            )}

            {showHeaderType === 'goto' && (
              <GoToHeader
                title={title}
                subtitle={subtitle || ''}
                pageNumber={pageNumber}
                totalPages={totalPages}
              />
            )}

            {showStarsAndReviews && averageRating !== undefined && (
              <div className="mt-2 flex items-center space-x-1 px-4">
                {renderStars(averageRating)}
                <p className="text-black text-sm ml-2 text-xs font-inter">
                  {reviewCount} Reviews
                </p>
              </div>
            )}

            {showPurchaseCount && purchaseCount !== undefined && (
              <p className="px-4 text-black text-sm text-xs font-inter mt-2">
                <span className="font-bold">{purchaseCount}</span> people have
                purchased this package
              </p>
            )}

            {/* About section */}
            <p className="px-4 text-xs font-poppins font-semibold text-text-color1 mt-4">
              About
            </p>

            {/* Carousel */}
            <div className="flex justify-center mt-2 w-full px-4">
              <Carousel slides={slides} />
            </div>

            {/* LocationBlock */}
            {showLocationBlock && address && (
              <div className="flex justify-center mt-2 w-full px-4 overflow-hidden">
                <LocationBlock address={address} />
              </div>
            )}

            {/* Creator's Words */}
            <div className="flex justify-center mt-2 w-full px-4">
              <TextBlock title="Creator's words:" text={creatorWords} />
            </div>

            {/* Specifics */}
            <div className="flex justify-center mt-2 w-full px-4">
              <DetailsBlock title="Specifics" details={specifics} />
            </div>

            {/* Reviews List */}
            {showReviewsList && (
              <div className="flex justify-center mt-2 w-full px-4">
                <ReviewsList />
              </div>
            )}

            {/* Button and Logo */}
            {showButtonAndLogo && (
              <div className="relative w-full flex justify-end items-center my-4 pr-6">
                <span className="absolute left-1/2 transform -translate-x-1/2 font-poppins font-bold italic text-text-color1 text-lg">
                  Inzider
                </span>
                <button className="bg-custom-purple py-2 px-4 text-white font-poppins rounded-md transition transform active:scale-95 active:shadow-none duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
                  Get it!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoToPageUnified;
