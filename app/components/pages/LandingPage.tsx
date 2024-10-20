'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons
import Nav from '../Nav';
import GoToCard from '../GoToCard';

interface landingPageProps {
  onNavigate: (page: string) => void; // Updated function signature to accept optional gameTypeParam
  title?: string;
  description?: string;
  buttonText?: string;
}

const LandingPage: React.FC<landingPageProps> = ({
  onNavigate,
  title = 'Create, sell and share your Go-to places and travel itineraries',
  description = 'Put a link in your bio to your go-tos and start sharing and selling your favorit spots today.',
  buttonText = 'Get Started',
}) => {
  // Handle navigation when the card is clicked
  // General handler function
  const handleButtonClick = (buttonType: string) => {
    switch (buttonType) {
      case 'start':
        onNavigate('CreatorLandingPage');
        break;
      case 'learnMore':
        onNavigate('AboutGoToPage');
        break;
      case 'card':
        onNavigate('GoToPage');
      case 'TripBrowsePage':
        onNavigate('TripBrowsePage');
        break;
      default:
        console.warn('Unhandled button type: ', buttonType);
    }
  };

  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp')",
      }}
    >
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Navigation component */}
      <Nav onNavigate={onNavigate} isWhiteText={true} />

      <div className="relative z-10 grid w-full h-screen px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 lg:py-16">
        {/* Card Section for Mobile ----------------------------------------------------------------------------------------*/}

        {/* GoToCard (Card Component) */}
        <div className="lg:col-span-4 md:col-span-3 flex justify-center lg:order-2 order-1">
          <GoToCard
            title="Drinks in San Sebastian"
            description="Having gone out in San Sebastian for most of my adult life I have now made a list of all the best spots that you don’t want to miss."
            imageUrl="/images/drinksSansebastian.jpg"
            country="Portugal"
            tag="Preview"
            stars={4} // 4 out of 5 stars
            onNavigate={onNavigate}
            navigateTo="AboutGoToPage"
          />
        </div>
        {/* Text Section with Slide-in Animation */}
        <div className="lg:col-span-7 lg:ml-10 mr-auto place-self-center text-left lg:order-1 order-2 animate-slide-in-left">
          <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl mb-6 font-light text-white lg:mb-8 text-sm md:text-lg lg:text-xl">
            {description}
          </p>
          <button
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-left text-white bg-custom-purple mr-4 rounded-lg hover:scale-105 hover:shadow-2xl transition transform active:scale-95 active:shadow-none duration-200"
            onClick={() => handleButtonClick('TripBrowsePage')}
          >
            Get started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-left text-white bg-black rounded-lg hover:scale-105 hover:shadow-2xl transition transform active:scale-95 active:shadow-none duration-200"
            onClick={() => handleButtonClick('learnMore')}
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
