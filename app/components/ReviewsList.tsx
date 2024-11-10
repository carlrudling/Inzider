import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Import star icons

const ReviewsList = () => {
  // Sample reviews data (added more demo reviews)
  const reviews = [
    { rating: 3, text: 'Good but not so detailed.' },
    {
      rating: 2,
      text: 'Interesting to see but too expensive to do any of it yourself.',
    },
    {
      rating: 5,
      text: 'Such an amazing trip and so nice to follow in her footsteps.',
    },
    { rating: 4, text: 'Great experience overall, but a bit tiring.' },
    { rating: 5, text: 'Absolutely loved it! Would go again in a heartbeat.' },
    { rating: 3, text: 'It was good, but some parts felt rushed.' },
    {
      rating: 4,
      text: 'A solid recommendation for anyone looking for adventure.',
    },
    { rating: 5, text: 'Best trip I’ve had in years!' },
    { rating: 4, text: 'Lovely views and amazing guides.' },
  ];

  // State to manage how many reviews to show
  const [visibleReviews, setVisibleReviews] = useState(3);

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
            <p className="text-sm text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      {/* See more/See less button */}
      <div className="flex justify-center mt-4">
        {visibleReviews < reviews.length ? (
          <button
            onClick={toggleReviews}
            className="text-sm font-medium text-custom-purple "
          >
            See more
          </button>
        ) : (
          <button
            onClick={toggleReviews}
            className="text-sm font-medium text-custom-purple"
          >
            See less
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
