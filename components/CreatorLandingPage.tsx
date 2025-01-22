'use client';
import React from 'react';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface CreatorLandingPageProps {
  backgroundImage?: string;
  profileImage?: string;
  creatorName?: string;
  description?: string;
  instagramLink?: string;
  twitterLink?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  textColor?: string; // New prop
  username?: string; // Add username prop
}

const CreatorLandingPage: React.FC<CreatorLandingPageProps> = ({
  backgroundImage,
  profileImage,
  creatorName = 'Creator Name',
  description = '',
  instagramLink,
  twitterLink,
  buttonColor = '#726238',
  buttonTextColor = '#FFFFFF',
  textColor = '#FFFFFF', // Default text color
  username,
}) => {
  const router = useRouter();

  const handleButtonClick = (buttonType: string) => {
    switch (buttonType) {
      case 'showGoToCards':
        router.push(`/${username}/gotos`);
        break;
      case 'showTripCards':
        router.push(`/${username}/trips`);
        break;
      case 'insta':
        window.open(instagramLink, '_blank');
        break;
      case 'twitter':
        window.open(twitterLink, '_blank');
        break;
    }
  };

  const buttonStyle = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
  };

  const textStyle = {
    color: textColor,
  };

  return (
    <div
      className="relative flex flex-col items-center justify-between h-screen bg-cover bg-center"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `url('/images/defaultBackground.jpg')`,
      }}
    >
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Main content wrapper */}
      <div className="flex flex-col eqtAab items-center mx-auto px-4 w-full z-10">
        {/* Profile image */}
        <div className="relative w-28 h-28 mb-4 mt-14">
          <img
            src={profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full object-cover w-full h-full border-4 border-white"
          />
        </div>

        {/* Creator Name */}
        <p style={textStyle} className="font-poppins font-semibold text-lg">
          {creatorName}
        </p>

        {/* Description */}
        <p
          style={textStyle}
          className="font-sourceSansPro text-base text-center px-4 mb-8 max-w-xs md:max-w-md"
        >
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            style={buttonStyle}
            className="font-poppins py-4 px-6 rounded-lg font-semibold w-full"
            onClick={() => handleButtonClick('showGoToCards')}
          >
            My Go-tos
          </button>
          <button
            style={buttonStyle}
            className="font-poppins py-4 px-6 rounded-lg font-semibold w-full"
            onClick={() => handleButtonClick('showTripCards')}
          >
            My Trips
          </button>
        </div>
      </div>

      {/* Footer with logo and icons */}
      <div className="flex flex-col items-center mb-4 z-10">
        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-2">
          <button onClick={() => handleButtonClick('insta')}>
            <FaInstagram className="h-6 w-6 cursor-pointer" color={textColor} />
          </button>
          <button onClick={() => handleButtonClick('twitter')}>
            <FaTwitter className="h-6 w-6 cursor-pointer" color={textColor} />
          </button>
        </div>
        {/* Logo */}
        <div
          style={textStyle}
          className="text-sm mt-2 opacity-20 italic font-bold"
        >
          Inzider
        </div>
      </div>
    </div>
  );
};

export default CreatorLandingPage;
