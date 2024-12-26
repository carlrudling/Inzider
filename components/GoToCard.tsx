import React from 'react';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface GoToCardProps {
  title: string;
  description: string;
  imageUrl: string;
  country: string;
  tag: string;
  stars: number; // Number of stars to display
  navigateTo: string;
}

const GoToCard: React.FC<GoToCardProps> = ({
  title,
  description,
  imageUrl,
  country,
  tag,
  stars,
  navigateTo,
}) => {
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
    <Link
      href={navigateTo}
      className="block w-[300px] min-w-[300px] h-[420px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
    >
      {/* Image */}
      <img
        className="w-full h-48 object-cover rounded-t-xl"
        src={imageUrl}
        alt={title}
      />

      {/* Text Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex flex-row items-center mb-3">
          <h3 className="text-base font-bold text-text-color2 mr-2">{title}</h3>
          <span className="bg-indigo-100 text-indigo-800 text-center text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        </div>

        {/* Description container */}
        <div className="mb-4 flex-1">
          <p className="text-sm text-text-color1 line-clamp-4 whitespace-normal">
            {description}
          </p>
        </div>

        {/* Star Ratings and Country */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-text-color1">{country}</p>
          <div className="flex flex-row space-x-1">{renderStars()}</div>
        </div>
      </div>
    </Link>
  );
};

export default GoToCard;
