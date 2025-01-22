'use client';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Carousel from './Carousel';
import ReviewsList from './ReviewsList';
import DetailsBlock from './DetailsBlock';
import TextBlock from './TextBlock';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PaymentFormWrapper from './PaymentForm';
import ReviewForm from './ReviewForm';

interface Slide {
  type: 'image' | 'video';
  src: string;
}

interface Specific {
  label: string;
  value: string | number;
}

interface AboutPageComponentProps {
  title: string;
  price: string;
  currency: string;
  slides: Slide[];
  specifics: Specific[];
  creatorWords: string;
  reviewCount: number;
  averageRating: number;
  purchaseCount: number;
  status?: 'launch' | 'draft';
  contentType: 'trip' | 'goto';
  id: string;
  username: string;
  onGetItClick?: () => void;
  hasPurchased?: boolean;
  isLoading?: boolean;
  reviews?: Array<{
    rating: number;
    text: string;
    userName?: string;
  }>;
  spots?: Array<{
    title: string;
    location: string;
    description: string;
    specifics: Specific[];
    slides: Slide[];
  }>;
}

const AboutPageComponent: React.FC<AboutPageComponentProps> = ({
  title,
  price,
  currency,
  slides,
  specifics,
  creatorWords,
  reviewCount,
  averageRating,
  purchaseCount,
  status = 'draft',
  contentType,
  id,
  username,
  onGetItClick,
  hasPurchased = false,
  isLoading = false,
  reviews = [],
  spots = [],
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState('');

  const handleGetItClick = async () => {
    console.log('Get it clicked');
    if (!session) {
      console.log('No session, redirecting to login');
      router.push('/auth/signin');
      return;
    }

    console.log('Setting showPayment to true');
    setShowPayment(true);
    if (onGetItClick) {
      console.log('Calling onGetItClick');
      onGetItClick();
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful');
    router.push(`/payment/success?contentId=${id}&contentType=${contentType}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setError(errorMessage);
    setShowPayment(false);
  };

  const handleReviewSubmit = async (review: {
    rating: number;
    text: string;
  }) => {
    try {
      const response = await fetch(`/api/${contentType}s/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Refresh the page to show the new review
      router.refresh();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error; // Re-throw the error to be handled by the ReviewForm component
    }
  };

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

            {/* Stars and Reviews - Only show if there are reviews */}
            {(status === 'draft' || reviewCount > 0) && (
              <div className="mt-2 flex items-center space-x-1 px-4">
                {renderStars(averageRating)}
                <p className="text-black text-sm ml-2 text-xs font-inter">
                  {reviewCount} Reviews
                </p>
              </div>
            )}

            {/* Purchase count - Only show if there are purchases */}
            {(status === 'draft' || purchaseCount > 0) && (
              <p className="px-4 text-black text-sm text-xs font-inter mt-2">
                <span className="font-bold">{purchaseCount}</span> people have
                purchased this package
              </p>
            )}

            {/* About section */}
            <p className="px-4 text-xs font-poppins font-semibold text-text-color1 mt-4">
              About
            </p>

            {/* Carousel container - Only show if there are slides */}
            {(status === 'draft' || slides.length > 0) && (
              <div className="flex justify-center mt-2 w-full px-4">
                <Carousel slides={slides} />
              </div>
            )}

            {/* Creator's Words - Only show if there's content */}
            {(status === 'draft' ||
              (creatorWords && creatorWords.trim().length > 0)) && (
              <div className="flex justify-center mt-2 w-full px-4">
                <TextBlock title="Creator's words:" text={creatorWords} />
              </div>
            )}

            {/* Specifics - Only show if there are specifics */}
            {(status === 'draft' || specifics.length > 0) && (
              <div className="flex justify-center mt-2 w-full px-4">
                <DetailsBlock
                  title="Specifics"
                  details={[
                    { label: 'Number of spots', value: spots?.length || 0 },
                    ...(specifics || []),
                  ]}
                />
              </div>
            )}

            {/* Reviews List - Only show if there are reviews */}
            {(status === 'draft' || reviews.length > 0) && (
              <div className="flex justify-center mt-4 w-full px-4">
                <ReviewsList reviews={reviews} />
              </div>
            )}

            {/* Review Form - Only show for users who have purchased and haven't reviewed yet */}
            {hasPurchased && (
              <div className="flex justify-center mt-4 w-full px-4">
                {reviews.some(
                  (review) => review.userName === session?.user?.name
                ) ? (
                  <div className="w-full bg-gray-50 p-4 rounded-lg text-center text-gray-600 text-sm">
                    Thank you for your review! You can see it in the reviews
                    section above.
                  </div>
                ) : (
                  <ReviewForm onSubmit={handleReviewSubmit} />
                )}
              </div>
            )}

            {/* Payment Form */}
            {showPayment && (
              <div className="fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowPayment(false)}
                />
                <div className="relative z-10">
                  <PaymentFormWrapper
                    contentId={id}
                    contentType={contentType}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-600">
                      Payment Failed
                    </h3>
                    <button
                      onClick={() => setError('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{error}</p>
                  <button
                    onClick={() => setError('')}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Button and Logo */}
            <div className="relative w-full flex justify-end items-center my-4 pr-6">
              <span className="absolute left-1/2 transform -translate-x-1/2 font-poppins font-bold italic text-text-color1 text-lg">
                Inzider
              </span>
              {isLoading ? (
                <div className="bg-gray-300 py-2 px-4 rounded-md w-24 h-10 animate-pulse"></div>
              ) : hasPurchased ? (
                <button
                  onClick={onGetItClick}
                  className="bg-green-500 py-2 px-4 text-white font-poppins rounded-md transition transform active:scale-95 active:shadow-none duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  View Content
                </button>
              ) : (
                <button
                  onClick={handleGetItClick}
                  className="bg-custom-purple py-2 px-4 text-white font-poppins rounded-md transition transform active:scale-95 active:shadow-none duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Get it!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPageComponent;
