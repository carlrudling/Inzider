import React from 'react';
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons
import Carousel from '../Carousel';
import ReviewsList from '../ReviewsList';
import CreatorNav from '../CreatorNav';
import DetailsBlock from '../DetailsBlock';
import TextBlock from '../TextBlock';

interface AboutTripPageProps {
  onNavigate: (page: string) => void;
}
interface Slide {
  type: 'image' | 'video';
  src: string;
}

const AboutTripPage: React.FC<AboutTripPageProps> = ({ onNavigate }) => {
  // Carousel images
  const slides: Slide[] = [
    { type: 'image', src: '/images/drinksSansebastian.jpg' },
    { type: 'video', src: '/videos/surf.mp4' }, // Video example
    { type: 'image', src: '/images/drinksSansebastian.jpg' },
  ];

  const handleGetItPressed = () => {
    console.log('BTN Pressed');
  };

  const specifics = [
    { label: 'Last updated', value: '23 Oct 2023' },
    { label: 'Number of recommendations', value: 23 },
    { label: 'Category', value: 'Travel' }, // Add more details as needed
  ];

  return (
    <section className="relative h-screen overflow-y-auto flex flex-col items-center justify-start text-white bg-cover bg-center hide-scroll">
      <div className="w-full flex justify-center">
        <div className="eqtAab w-full max-w-[580px] mx-auto">
          {/* Main container for content */}
          <div className="flex flex-col mt-6 w-full">
            {/* Content aligned to the left with margin */}
            <div className="flex flex-row justify-between items-center px-4">
              {/* Heading and Price */}
              <h3 className="sm:text-lg text-base font-semibold font-poppins text-black mb-2 text-left">
                Drinks in San Sebastian
              </h3>
              {/* 'Bought' Badge */}
              <div className="bg-custom-white-blue text-custom-blue py-1 px-3 text-xs font-semibold font-poppins rounded-full">
                $49.99
              </div>
            </div>

            {/* Stars and Reviews */}
            <div className="mt-2 flex items-center space-x-1 px-4">
              <FaStar className="h-4 w-4 text-yellow-500" />
              <FaStar className="h-4 w-4 text-yellow-500" />
              <FaStar className="h-4 w-4 text-yellow-500" />
              <div className="relative h-4 w-4">
                <FaStar className="h-4 w-4 text-yellow-500 absolute" />
                <FaStar className="h-4 w-4 text-gray-200 absolute clip-half" />
              </div>
              <FaStar className="h-4 w-4 text-gray-200" />
              <p className="text-black text-sm ml-2 text-xs font-inter">
                36 Reviews
              </p>
            </div>

            {/* Purchase count */}
            <p className="px-4 text-black text-sm text-xs font-inter mt-2">
              <span className="font-bold">278</span> people have purchased this
              package
            </p>

            {/* About section */}
            <p className="px-4 text-xs font-poppins font-semibold text-text-color1 mt-4">
              About
            </p>

            {/* Carousel container - Center the carousel */}
            <div className="flex justify-center mt-2 w-full px-4">
              <Carousel slides={slides} />
            </div>

            {/* Creators Words */}
            <div className="flex justify-center mt-2 w-full px-4">
              <TextBlock
                title="Joseph's words:"
                text="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
              />
            </div>

            {/* Specifics */}
            <div className="flex justify-center mt-2 w-full px-4">
              <DetailsBlock title="Specifics" details={specifics} />
            </div>

            {/* Reviews List */}
            <div className="flex justify-center mt-2 w-full px-4">
              <ReviewsList />
            </div>

            {/* Button and Logo */}
            <div className="relative w-full flex justify-end items-center my-4 pr-6">
              {/* Logo Text */}
              <span className="absolute left-1/2 transform -translate-x-1/2 font-poppins font-bold italic text-text-color1 text-lg">
                Inzider
              </span>

              {/* Button */}
              <button className="bg-custom-purple py-2 px-4 text-white font-poppins rounded-md transition transform active:scale-95 active:shadow-none duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
                Get it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTripPage;
