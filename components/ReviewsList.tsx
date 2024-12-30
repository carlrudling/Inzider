import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface Review {
  rating: number;
  text: string;
  userName?: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  // State to manage how many reviews to show
  const [visibleReviews, setVisibleReviews] = useState(3);

  // If no reviews, don't render anything
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Function to toggle showing more or fewer reviews
  const toggleReviews = () => {
    if (visibleReviews >= reviews.length) {
      // Reset to show only the first 3 reviews
      setVisibleReviews(3);
    } else {
      // Show 3 more reviews or the remaining ones if less than 3 are left
      setVisibleReviews((prev) => Math.min(prev + 3, reviews.length));
    }
  };

  return (
    <div className="bg-white p-4 w-full rounded-lg shadow-md border border-gray-200">
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        Reviews:
      </h3>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-1 mb-2">
              {/* Render stars based on rating */}
              {[...Array(5)].map((_, starIndex) => (
                <FaStar
                  key={starIndex}
                  className={`h-4 w-4 ${
                    starIndex < review.rating
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {review.userName && (
              <p className="text-sm text-gray-500 mb-1">{review.userName}</p>
            )}
            <p className="text-sm text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      {/* See more/See less button - Only show if there are more than 3 reviews */}
      {reviews.length > 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleReviews}
            className="text-sm font-medium text-custom-purple"
          >
            {visibleReviews < reviews.length ? 'See more' : 'See less'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
