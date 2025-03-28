'use client';
import React, { useRef, useEffect, useState } from 'react';
import { FaStar, FaPlay } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  navigateTo: string;
  country?: string;
  tag?: string;
  stars?: number;
  price?: number | string;
  currency?: string;
  mediaType?: 'image' | 'video';
}

const Card: React.FC<CardProps> = (props) => {
  const {
    title,
    description,
    imageUrl,
    country,
    tag,
    stars,
    price,
    currency,
    navigateTo,
    mediaType = 'image',
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  // Convert price to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // More detailed logging
  console.log('Card props (detailed):', {
    title,
    price,
    numericPrice,
    currency,
    priceType: typeof price,
    currencyType: typeof currency,
  });

  useEffect(() => {
    // Clean up function to revoke object URLs
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [thumbnailUrl]);

  const generateThumbnail = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');

    try {
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        setThumbnailUrl(thumbnailUrl);
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      // Fallback to a default thumbnail or handle the error gracefully
    }
  };

  const handleVideoLoad = (video: HTMLVideoElement) => {
    // Make sure video is loaded enough to seek
    if (video.readyState >= 2) {
      // Set to 1 second or 25% of duration, whichever is less
      const seekTime = Math.min(1, video.duration * 0.25);
      video.currentTime = seekTime;
    } else {
      // If video is not loaded enough, wait for loadeddata event
      video.addEventListener(
        'loadeddata',
        () => {
          const seekTime = Math.min(1, video.duration * 0.25);
          video.currentTime = seekTime;
        },
        { once: true }
      );
    }
  };

  const handleClick = () => {
    // If we're in the creator's public view, use the public route
    if (pathname.startsWith('/dashboard')) {
      router.push(navigateTo);
    } else if (pathname.startsWith('/user')) {
      // For the user dashboard, use the navigateTo path directly
      // as it already contains the full path with username
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

  const getProxiedUrl = (url: string) => {
    // Extract the key from the R2 URL
    const key = url.split('/').pop();
    if (!key) return url;
    return `/api/media/${key}`;
  };

  return (
    <div
      onClick={handleClick}
      className="w-[300px] min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Image/Video container with fixed height and full width */}
      <div className="relative h-[200px] w-full">
        {mediaType === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={getProxiedUrl(imageUrl)}
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              onLoadedMetadata={(e) =>
                handleVideoLoad(e.target as HTMLVideoElement)
              }
              onSeeked={(e) => generateThumbnail(e.target as HTMLVideoElement)}
              muted
              preload="metadata"
              style={{ display: thumbnailUrl ? 'none' : 'block' }}
            />
            {thumbnailUrl && (
              <div className="absolute inset-0">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {price !== undefined && currency ? `${currency} ${price}` : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content section with flex layout */}
      <div className="p-3 h-36 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          {stars !== undefined && (
            <div className="flex items-center">
              <FaStar className="text-yellow-400 w-4 h-4" />
              <span className="ml-1 text-sm">{stars.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-1 line-clamp-4">{description}</p>
        <div className="mt-auto flex justify-end items-center"></div>
      </div>
    </div>
  );
};

export default Card;
