import React from 'react';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

const CreatorLandingPage = () => {
  const handleButtonClick = (buttonType: string) => {
    switch (buttonType) {
      case 'insta':
        console.log('Now you gets navigated to Instagram');
        break;
      case 'X/twitter':
        console.log('Now you gets navigated to X/twitter');
        break;
      case 'showGoToCards':
        console.log('Now all go-to packages are shown');
        break;
      case 'showTripCards':
        console.log('Now all trip packages are shown');
        break;
      default:
        console.warn('Unhandled button type: ', buttonType);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-start h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/drinksSansebastian.jpg')`, // Correct way to set the background image
      }}
    >
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Main content wrapper */}
      <div className="eqtAab flex flex-col items-center mx-auto px-4 w-full z-10">
        {/* Top section with logo and social media icons */}
        <div className="flex justify-between items-center w-full mt-4 mb-8">
          {/* Logo */}
          <div className="text-white text-lg font-bold">Inzider</div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <button onClick={() => handleButtonClick('insta')}>
              <FaInstagram className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
            </button>
            <button onClick={() => handleButtonClick('X/twitter')}>
              <FaTwitter className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Profile image */}
        <div className="relative w-28 h-28 mb-4 mt-8">
          <img
            src="https://via.placeholder.com/150" // Replace with the actual profile image
            alt="Profile"
            className="rounded-full object-cover w-full h-full border-4 border-white"
          />
        </div>

        {/* Description */}
        <p className="font-poppins font-semibold text-white text-lg mb-4">
          Joseph Garcia
        </p>
        <p className="text-white font-sourceSansPro text-base text-center px-4 mb-8 max-w-xs md:max-w-md">
          Get inside information to all my go-tos and trips.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            className="bg-white text-text-color2 font-poppins py-4 px-6 rounded-lg font-semibold w-full"
            onClick={() => handleButtonClick('showGoToCards')}
          >
            My Go-tos
          </button>
          <button
            className="bg-white text-text-color2 font-poppins py-4 px-6 rounded-lg font-semibold w-full"
            onClick={() => handleButtonClick('showTripCards')}
          >
            My Trips
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorLandingPage;
