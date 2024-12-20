import React from 'react';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import GoToCard from '../../../../components/GoToCard';

const TripBrowsePage = () => {
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
      <div className="eqtAab flex flex-col items-center mx-auto px-4 w-full z-10 overflow-y-auto">
        {/* Top section with logo and social media icons */}
        <div className="flex justify-between items-center w-full mt-4 mb-8">
          {/* Logo */}
          <div className="opacity-50 logo_text">Inzider</div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <button onClick={() => handleButtonClick('insta')}>
              <FaInstagram className="h-6 w-6 text-white opacity-50 cursor-pointer hover:opacity-100" />
            </button>
            <button onClick={() => handleButtonClick('X/twitter')}>
              <FaTwitter className="h-6 w-6 text-white opacity-50 cursor-pointer hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="font-poppins font-semibold text-white text-lg mb-4">
          My Trips
        </p>
        <p className="text-white font-sourceSansPro text-base text-center px-4 mb-8 max-w-xs md:max-w-md">
          Get inside information to all my go-tos and trips.
        </p>
        <div className="flex-col space-y-2">
          <GoToCard
            title="Surf Trip in Indonesia"
            description="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
            imageUrl="/images/surf-trip-indonesia.jpg"
            country="Indonesia"
            tag="New"
            stars={4} // 4 out of 5 stars
            navigateTo="AboutTripPage"
          />
          <GoToCard
            title="Surf Trip in Indonesia"
            description="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
            imageUrl="/images/surf-trip-indonesia.jpg"
            country="Indonesia"
            tag="New"
            stars={5} // 4 out of 5 stars
            navigateTo="AboutTripPage"
          />
          <GoToCard
            title="Surf Trip in Indonesia"
            description="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
            imageUrl="/images/surf-trip-indonesia.jpg"
            country="Indonesia"
            tag="New"
            stars={2} // 4 out of 5 stars
            navigateTo="AboutTripPage"
          />
          <GoToCard
            title="Surf Trip in Indonesia"
            description="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
            imageUrl="/images/surf-trip-indonesia.jpg"
            country="Indonesia"
            tag="New"
            stars={3} // 4 out of 5 stars
            navigateTo="AboutTripPage"
          />
        </div>
      </div>
    </div>
  );
};

export default TripBrowsePage;
