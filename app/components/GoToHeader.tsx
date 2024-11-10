import React from 'react';
import { FaCoffee } from 'react-icons/fa'; // You can replace this with any other icon

interface GoToHeaderProps {
  icon?: React.ReactNode; // Allows you to pass any icon
  title: string; // The main title of the card
  subtitle: string; // The subtitle below the title
  pageNumber: string; // Page number on the right side
  totalPages: string; // Page number on the right side
}

const GoToHeader: React.FC<GoToHeaderProps> = ({
  icon = <FaCoffee />,
  title,
  subtitle,
  pageNumber,
  totalPages,
}) => {
  return (
    <div className="flex justify-between items-start p-4 w-full">
      <div className="flex items-center">
        {/* Icon */}
        <div className="mr-4 text-2xl text-text-color2">{icon}</div>

        {/* Title and Subtitle */}
        <div>
          <h3 className="font-semibold text-lg text-text-color2 font-poppins">
            {title}
          </h3>
          <p className="text-text-color1 italic font-sourceSansPro text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Page Number */}
      <div className="self-end text-text-color1 font-sourceSansPro text-sm">
        {pageNumber}/{totalPages}
      </div>
    </div>
  );
};

export default GoToHeader;
