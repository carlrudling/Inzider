import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

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

  drag(drop(ref));

  return (
    <div ref={ref} className="relative w-24 h-24">
      {file instanceof File ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="rounded-md w-full h-full object-cover"
        />
      ) : (
        <img
          src={file.src}
          alt="Uploaded"
          className="rounded-md w-full h-full object-cover"
        />
      )}
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
