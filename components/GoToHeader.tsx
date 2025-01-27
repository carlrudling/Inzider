import React from 'react';

interface GoToHeaderProps {
  title: string; // The main title of the card
  subtitle: string; // The subtitle below the title
  pageNumber?: string; // Page number on the right side
  totalPages?: string; // Page number on the right side
  day?: string;
}

const GoToHeader: React.FC<GoToHeaderProps> = ({
  title,
  subtitle,
  pageNumber,
  totalPages,
  day,
}) => {
  return (
    <div className="flex justify-between items-start p-4 w-full">
      <div className="flex items-center">
        {/* Icon */}

        {/* Title and Subtitle */}
        <div>
          <h3 className="font-semibold text-lg text-[#1C1C1C] font-satoshi">
            {title}
          </h3>
          <p className="text-text-color1 italic font-satoshi text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Page Number */}
      <div className="self-end text-text-color1 font-satoshi text-sm">
        {day ? (
          <span>{day}</span> // Display day if available
        ) : (
          <span>
            {pageNumber}/{totalPages}
          </span> // Otherwise, display page number
        )}
      </div>
    </div>
  );
};

export default GoToHeader;
