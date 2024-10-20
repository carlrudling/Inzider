// components/GoToCard.tsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

interface GoToCardProps {
  title: string;
  description: string;
  imageUrl: string;
  country: string;
  tag: string;
  stars: number; // Number of stars to display
  onNavigate: (page: string) => void;
  navigateTo: string;
}

const GoToCard: React.FC<GoToCardProps> = ({
  title,
  description,
  imageUrl,
  country,
  tag,
  stars,
  onNavigate,
  navigateTo,
}) => {
  // Handle button click to navigate to the GoToPage
  const handleClick = () => {
    onNavigate(navigateTo);
  };

  // Function to render the star ratings based on the number of stars passed
  const renderStars = () => {
    const fullStars = Math.floor(stars);
    const totalStars = 5; // Assuming 5 as the maximum number of stars
    const emptyStars = totalStars - fullStars;

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <FaStar
              key={`full-star-${index}`}
              className="h-4 w-4 text-yellow-500"
            />
          ))}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <FaStar
              key={`empty-star-${index}`}
              className="h-4 w-4 text-gray-200"
            />
          ))}
      </>
    );
  };

  return (
    <div className="max-w-xs h-80 bg-white border shadow-sm rounded-xl flex flex-col justify-between">
      {/* Image */}
      <img
        className="w-full h-40 object-cover rounded-t-xl"
        src={imageUrl}
        alt={title}
      />

      {/* Text Content */}
      <div className="text-left p-4 md:p-5 flex-grow" onClick={handleClick}>
        <div className="flex flex-row items-center">
          <h3 className="sm:text-md text-base font-bold text-text-color2 mr-2">
            {title}
          </h3>
          <span className="bg-indigo-100 text-indigo-800 text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
            {tag}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-color1 line-clamp-3">
          {description}
        </p>
      </div>

      {/* Star Ratings and Country */}
      <div className="flex justify-between items-center px-4 pb-4">
        <p className="text-sm text-text-color1">{country}</p>
        <div className="flex flex-row space-x-1">{renderStars()}</div>
      </div>
    </div>
  );
};

export default GoToCard;
