import React from 'react';

interface TextBlockProps {
  title: string;
  text: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ title, text }) => {
  // If text is empty or only whitespace, don't render anything
  if (!text || !text.trim()) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        {title}
      </h3>
      <p className="font-sourceSansPro text-text-color2 ml-4 text-sm whitespace-normal break-words">
        {text}
      </p>
    </div>
  );
};

export default TextBlock;
