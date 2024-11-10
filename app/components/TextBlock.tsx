import React from 'react';

interface TextBlockProps {
  title: string;
  text: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ title, text }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        {title}
      </h3>
      <p className="font-sourceSansPro text-text-color2 ml-4 text-base">
        {text}
      </p>
    </div>
  );
};

export default TextBlock;
