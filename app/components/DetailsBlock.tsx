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
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        {title}
      </h3>
      {details.map((detail, index) => (
        <p
          key={index}
          className="font-sourceSansPro text-text-color2 ml-4 text-base"
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
