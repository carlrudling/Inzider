'use client';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface Review {
  rating: number;
  text: string;
  userName?: string;
}

interface ReviewsListProps {
  reviews?: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews = [] }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const initialReviewCount = 3;

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = showAllReviews
    ? reviews
    : reviews.slice(0, initialReviewCount);

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4">
        <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-4">
          Reviews ({reviews.length})
        </h3>
        <div className="space-y-4">
          {displayedReviews.map((review, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-700">
                  {review.userName || 'Anonymous'}
                </span>
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>

        {reviews.length > initialReviewCount && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-custom-purple hover:text-custom-purple-dark font-medium text-sm transition-colors duration-200"
            >
              {showAllReviews
                ? 'Show less'
                : `Show all ${reviews.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
