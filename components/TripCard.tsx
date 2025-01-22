import React from 'react';
import { FaStar } from 'react-icons/fa';

interface TripCardProps {
  title: string;
  description: string;
  country: string;
  imageUrl: string;
  stars: number;
}

const TripCard: React.FC<TripCardProps> = ({
  title,
  description,
  country,
  imageUrl,
  stars,
}) => {
  return (
    <div className="flex bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Image Section */}
      <div className="w-1/2">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Text and Details Section */}
      <div className="w-1/2 p-6 flex flex-col justify-between">
        {/* Title and Description */}
        <div>
          <h2 className="text-md font-bold text-black flex items-center">
            {title}
            <span className="ml-2">🏄‍♂️</span> {/* Emoji for decoration */}
          </h2>
          <p className="mt-4 text-gray-600">{description}</p>
        </div>

        {/* Country and Stars */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-500">{country}</p>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`h-5 w-5 ${
                  index < stars ? 'text-yellow-500' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
