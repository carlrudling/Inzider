import React from 'react';

interface Detail {
  label: string;
  value: string | number;
}

interface DetailsBlockProps {
  title: string;
  details: Detail[];
}

const DetailsBlock: React.FC<DetailsBlockProps> = ({ title, details }) => {
  // Filter out invalid details (empty label or value)
  const validDetails = details.filter(
    (detail) =>
      detail.label?.trim() &&
      (detail.value?.toString()?.trim() || detail.value === 0)
  );

  if (validDetails.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        {title}
      </h3>
      {validDetails.map((detail, index) => (
        <p
          key={index}
          className="font-sourceSansPro text-text-color2 ml-4 text-sm"
        >
          <span className="font-semibold text-text-color2">
            {detail.label}:{' '}
          </span>
          {detail.value}
        </p>
      ))}
    </div>
  );
};

export default DetailsBlock;
