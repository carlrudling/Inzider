'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  country: string;
  tag: string;
  stars: number;
  navigateTo: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  country,
  tag,
  stars,
  navigateTo,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // If we're in the creator's public view, use the public route
    if (pathname.startsWith('/dashboard')) {
      router.push(navigateTo);
    } else {
      // Extract username from current path
      const username = pathname.split('/')[1];
      const parts = navigateTo.split('/');
      const id = parts[parts.length - 1]; // Get the ID

      // Determine the content type and ensure plural form
      let contentType = parts[parts.length - 2]; // Get 'trip' or 'goto'
      if (contentType === 'trip' || contentType === 'edit-trip') {
        contentType = 'trips';
      } else if (contentType === 'goto' || contentType === 'edit-goto') {
        contentType = 'gotos';
      }

      router.push(`/${username}/${contentType}/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-[300px] min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Image container with fixed height and full width */}
      <div className="relative h-[200px] w-full">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {tag}
          </span>
        </div>
      </div>

      {/* Content section with flex layout */}
      <div className="p-3 h-36 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span className="ml-1 text-sm">{stars.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-1 line-clamp-2">{description}</p>
        <p className="text-gray-500 text-xs mt-auto">{country}</p>
      </div>
    </div>
  );
};

export default Card;
