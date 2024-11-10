'use client';
import React from 'react';
import Nav from '../Nav';
import GoToCard from '../GoToCard';
import { BiSolidCircle } from 'react-icons/bi';
import Lightbulb from '@/app/utils/icons/Lightbulb';
import Coin from '@/app/utils/icons/Coin';
import Gear from '@/app/utils/icons/Gear';
import { FaInstagram } from 'react-icons/fa';

interface landingPageProps {
  onNavigate: (page: string) => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const LandingPage: React.FC<landingPageProps> = ({
  onNavigate,
  title = 'Create, sell and share your Go-to places and travel itineraries',
  description = 'Put a link in your bio to your go-tos and start sharing and selling your favorite spots today.',
  buttonText = 'Get Started',
}) => {
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
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center text-white bg-cover bg-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/landingPageVideo.mp4" // Relative path from public folder
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute w-full top-0">
          <Nav onNavigate={onNavigate} isWhiteText={true} />
        </div>
        <div className="relative z-10 flex flex-col items-center space-y-4 text-center px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-lg font-light text-white opacity-90">
            {description}
          </p>
        </div>
      </section>

      {/* Additional Section 1 */}
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center py-16 bg-custom-new-lightblue">
        <h2 className="text-xl md:text-2xl lg:text-2xl lg:text-left md:text-left text-center mb-10 md:mb-0 lg:mb-0 font-poppins mx-20 text-text-color2 w-80">
          Share your best memories with your followers and let them to live in
          your footsteps
        </h2>
        <div className="flex flex-col items-center mx-20 space-y-10 ">
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
          <p className="max-w-3xl mb-6 font-light italic">Preview</p>
        </div>
      </section>

      {/* Additional Section 2 */}
      <section className="flex flex-col items-center font-poppins justify-center h-80 py-16 bg-white text-center text-text-color1">
        <h2 className="text-xl md:text-3xl md:text-3xl italic mb-4 flex items-center space-x-2">
          <span>Easy</span>
          <BiSolidCircle className="text-[6px] md:text-[10px] lg:text-[10px]" />
          <span>Profitable</span>
          <BiSolidCircle className="text-[6px] md:text-[10px] lg:text-[10px]" />
          <span>Personalised</span>
        </h2>
      </section>

      {/* Additional Section 3 */}
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center py-16 bg-custom-new-yellow text-center text-gray-800">
        <Lightbulb
          width="100"
          height="100"
          className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
        />
        <div className="text-left md:mx-20 lg:mx-20 mx-4 mt-4">
          <h2 className="-xl md:textextt-3xl font-poppins font-semibold mb-4">
            Easy
          </h2>
          <p className="text-md md:text-xl lg:text-xl mb-6 font-light w-80">
            Making it easy for everyone: Customers can find your packages
            directly through a simple link in your bio. For creators, setting up
            and managing trips is quick and hassle-free, saving you time and
            energy.
          </p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center bg-white py-16 text-center text-text-color2 h-80">
        <h2 className="text-xl lg:text-3xl md:text-3xl mb-4 flex items-center font-poppins font-semibold mb-10 mx-4">
          Join a movement of creatives shaping the future of travel
        </h2>
        <button
          className="px-6 py-3 font-semibold text-text-color2 font-poppins bg-custom-new-lightBeige rounded-full  hover:scale-105 hover:shadow-lg transition transform active:scale-95 active:shadow-none duration-200"
          onClick={() => onNavigate('loading')}
        >
          Join
        </button>
      </section>
      <section className="flex lg:flex-row-reverse md:flex-row flex-col items-center justify-center py-16 bg-custom-new-lightBeige text-center text-gray-800">
        <Coin
          width="100"
          height="100"
          className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
        />
        <div className="text-left md:mx-20 lg:mx-20 mx-4 mt-4">
          <h2 className="text-xl md:text-3xl font-poppins font-semibold mb-4">
            Profitable
          </h2>
          <p className="text-md md:text-xl lg:text-xl mb-6 font-light w-80">
            You set your own price. After Stripe processing fees and our 20%
            service cut, you keep the rest—no hidden costs.
          </p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center bg-white py-16 text-center text-text-color2 h-80">
        <h2 className="text-xl lg:text-3xl md:text-3xl mb-4 flex items-center font-poppins font-semibold mb-10 mx-4">
          A new way to interact with your followers
        </h2>
      </section>
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center py-16 bg-custom-new-yellow text-center text-gray-800">
        <Gear
          width="100"
          height="100"
          className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
        />
        <div className="text-left md:mx-20 lg:mx-20 mx-4 mt-4">
          <h2 className="text-xl md:text-3xl font-poppins font-semibold mb-4">
            Personalised
          </h2>
          <p className="text-md md:text-xl lg:text-xl mb-6 font-light w-80">
            Fully personalize your trip itineraries and packages with a simple
            drag-and-drop interface, making it easy to tailor the experience to
            your audience.
          </p>
        </div>
      </section>
      <footer className="flex flex-col items-center justify-center py-16 bg-custom-new-darkPurple text-center text-gray-800">
        <div className=" sm:items-center sm:justify-between">
          <h2 className="self-center logo_text whitespace-nowrap dark:text-white mb-4">
            Inzider
          </h2>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                User Agreement
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025{' '}
          <a href="https://flowbite.com/" className="hover:underline">
            Inzider™
          </a>
          . All Rights Reserved.
        </span>

        <FaInstagram className="w-6 h-6 mt-2 text-gray-500  dark:text-gray-400 cursor-pointer" />
      </footer>
    </div>
  );
};

export default LandingPage;
