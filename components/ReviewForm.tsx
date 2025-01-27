'use client';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; text: string }) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!text.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ rating, text });
      // Reset form after successful submission
      setRating(0);
      setText('');
    } catch (err: any) {
      // Handle specific error messages from the server
      if (err.message.includes('already reviewed')) {
        setError('You have already submitted a review for this content.');
      } else if (err.message.includes('must purchase')) {
        setError('You need to purchase this content before leaving a review.');
      } else {
        setError(err.message || 'Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 w-full rounded-lg shadow-md border border-gray-200">
      <h3 className="font-semibold font-satoshi text-sm text-text-color1 mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <FaStar
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Review Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-purple mb-4 text-[#1C1C1C]"
          rows={4}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-custom-purple text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
