import React from 'react';
import { FaStar } from 'react-icons/fa';
import Carousel from '../Carousel';
import ReviewsList from '../ReviewsList';
import DetailsBlock from '../DetailsBlock';
import TextBlock from '../TextBlock';

interface Slide {
  type: 'image' | 'video';
  src: string;
}

interface Specific {
  label: string;
  value: string | number;
}

interface AboutTripPageProps {
  onNavigate: (page: string) => void;
  title: string;
  price: string;
  currency: string; // Currency code (e.g., "USD", "EUR")
  slides: Slide[];
  specifics: Specific[];
  creatorWords: string;
  reviewCount: number;
  averageRating: number;
  purchaseCount: number;
}

const AboutTripPage: React.FC<AboutTripPageProps> = ({
  onNavigate,
  title,
  price,
  currency,
  slides,
  specifics,
  creatorWords,
  reviewCount,
  averageRating,
  purchaseCount,
}) => {
  // Map of currency codes to symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    // Add additional currency mappings as needed
  };

  // Render stars based on the average rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill(null)
          .map((_, i) => (
            <FaStar key={`full-${i}`} className="h-4 w-4 text-yellow-500" />
          ))}
        {hasHalfStar && (
          <div className="relative h-4 w-4">
            <FaStar className="h-4 w-4 text-yellow-500 absolute" />
            <FaStar className="h-4 w-4 text-gray-200 absolute clip-half" />
          </div>
        )}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <FaStar key={`empty-${i}`} className="h-4 w-4 text-gray-200" />
          ))}
      </>
    );
  };

  return (
    <section className="relative h-screen overflow-y-auto flex flex-col items-center justify-start text-white bg-cover bg-center hide-scroll">
      <div className="w-full flex justify-center">
        <div className="eqtAab w-full max-w-[460px] mx-auto">
          {/* Main container for content */}
          <div className="flex flex-col mt-6 w-full">
            {/* Content aligned to the left with margin */}
            <div className="flex flex-row justify-between items-center px-4">
              {/* Heading and Price */}
              <h3 className="sm:text-lg text-base font-semibold font-poppins text-black mb-2 text-left">
                {title}
              </h3>
              <div className="bg-custom-white-blue text-custom-blue py-1 px-3 text-sm font-semibold font-poppins rounded-full">
                {/* Show currency symbol */}
                {currencySymbols[currency] || currency}
                {price}
              </div>
            </div>

            {/* Stars and Reviews */}
            <div className="mt-2 flex items-center space-x-1 px-4">
              {renderStars(averageRating)}
              <p className="text-black text-sm ml-2 text-xs font-inter">
                {reviewCount} Reviews
              </p>
            </div>

            {/* Purchase count */}
            <p className="px-4 text-black text-sm text-xs font-inter mt-2">
              <span className="font-bold">{purchaseCount}</span> people have
              purchased this package
            </p>

            {/* About section */}
            <p className="px-4 text-xs font-poppins font-semibold text-text-color1 mt-4">
              About
            </p>

            {/* Carousel container - Center the carousel */}
            <div className="flex justify-center mt-2 w-full px-4">
              <Carousel slides={slides} />
            </div>

            {/* Creator's Words */}
            <div className="flex justify-center mt-2 w-full px-4">
              <TextBlock title="Creator's words:" text={creatorWords} />
            </div>

            {/* Specifics */}
            <div className="flex justify-center mt-2 w-full px-4">
              <DetailsBlock title="Specifics" details={specifics} />
            </div>

            {/* Reviews List */}
            <div className="flex justify-center mt-2 w-full px-4">
              <ReviewsList />
            </div>

            {/* Button and Logo */}
            <div className="relative w-full flex justify-end items-center my-4 pr-6">
              <span className="absolute left-1/2 transform -translate-x-1/2 font-poppins font-bold italic text-text-color1 text-lg">
                Inzider
              </span>
              <button className="bg-custom-purple py-2 px-4 text-white font-poppins rounded-md transition transform active:scale-95 active:shadow-none duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
                Get it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTripPage;
