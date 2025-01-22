import React, { useRef, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaPlay } from 'react-icons/fa';

interface SlideItemProps {
  file: File | { src: string; type: 'image' | 'video' };
  index: number;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  handleRemoveMedia: (index: number) => void;
}

const SlideItem: React.FC<SlideItemProps> = ({
  file,
  index,
  moveSlide,
  handleRemoveMedia,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  const [, drag] = useDrag({
    type: 'SLIDE',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'SLIDE',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveSlide(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
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
    canvas
      .getContext('2d')
      ?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    try {
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      setThumbnailUrl(thumbnailUrl);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const handleVideoLoad = (video: HTMLVideoElement) => {
    // Set the current time to 1 second to skip potential black frames at the start
    video.currentTime = 1;
    video.addEventListener('seeked', () => generateThumbnail(video), {
      once: true,
    });
  };

  drag(drop(ref));

  const getProxiedUrl = (url: string) => {
    // Extract the key from the R2 URL
    const key = url.split('/').pop();
    if (!key) return url;
    return `/api/media/${key}`;
  };

  const renderMedia = () => {
    if (file instanceof File) {
      // For newly uploaded files
      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        return (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={URL.createObjectURL(file)}
              className="rounded-md w-full h-full object-cover"
              onLoadedMetadata={(e) =>
                handleVideoLoad(e.target as HTMLVideoElement)
              }
              muted
              style={{ display: thumbnailUrl ? 'none' : 'block' }}
            />
            {thumbnailUrl && (
              <div className="absolute inset-0">
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="rounded-md w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <FaPlay className="text-white text-xl" />
                </div>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="rounded-md w-full h-full object-cover"
          />
        );
      }
    } else {
      // For existing files
      if (file.type === 'video') {
        return (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={getProxiedUrl(file.src)}
              crossOrigin="anonymous"
              className="rounded-md w-full h-full object-cover"
              onLoadedMetadata={(e) =>
                handleVideoLoad(e.target as HTMLVideoElement)
              }
              muted
              style={{ display: thumbnailUrl ? 'none' : 'block' }}
            />
            {thumbnailUrl && (
              <div className="absolute inset-0">
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="rounded-md w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <FaPlay className="text-white text-xl" />
                </div>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <img
            src={file.src}
            alt="Uploaded"
            className="rounded-md w-full h-full object-cover"
          />
        );
      }
    }
  };

  return (
    <div ref={ref} className="relative w-24 h-24">
      {renderMedia()}
      <button
        onClick={() => handleRemoveMedia(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        style={{ fontSize: '14px', lineHeight: '1' }}
      >
        &times;
      </button>
    </div>
  );
};

export default SlideItem;
