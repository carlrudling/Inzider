import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Carousel from '../Carousel';
import TextBlock from '../TextBlock';
import DetailsBlock from '../DetailsBlock';
import LocationBlock from '../LocationBlock';
import GoToHeader from '../GoToHeader';

interface GoToPageProps {
  onNavigate: (page: string) => void;
}
interface Slide {
  type: 'image' | 'video';
  src: string;
}

const GoToPage: React.FC<GoToPageProps> = ({ onNavigate }) => {
  const [isScrollable, setIsScrollable] = useState(false);

  // Carousel images
  const slides: Slide[] = [
    { type: 'image', src: '/images/drinksSansebastian.jpg' },
    { type: 'video', src: '/videos/surfing.mp4' }, // Video example
    { type: 'image', src: '/images/drinksSansebastian.jpg' },
  ];

  // Detect if the content is scrollable
  useEffect(() => {
    const handleScroll = () => {
      const isPageScrollable =
        document.documentElement.scrollHeight > window.innerHeight;
      setIsScrollable(isPageScrollable);
    };

    handleScroll(); // Run on mount
    window.addEventListener('resize', handleScroll); // Recalculate on resize

    return () => {
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      className={`relative h-screen overflow-y-auto flex flex-col items-center justify-start text-white bg-cover bg-center hide-scroll ${
        isScrollable ? 'scrollable' : ''
      }`}
    >
      <div className="w-full flex justify-center">
        <div className="eqtAab w-full max-w-[580px] mx-auto">
          <GoToHeader
            title="Djournal Coffee Bar"
            subtitle="Drinks in San Sebastian"
            pageNumber="1"
            totalPages="27"
          />

          {/* Main content */}
          <div className="content flex flex-col w-full">
            <div className="flex justify-center w-full px-4">
              <Carousel slides={slides} />
            </div>

            <LocationBlock address="Essinge Högväg 38, 112 65, Stockholm, Sweden" />

            <div className="flex justify-center mt-2 w-full px-4">
              <TextBlock
                title="Joseph's words:"
                text="Join me on a surf adventure through Indonesia's top beaches! Perfect waves, tropical scenery, and local culture made this trip unforgettable."
              />
            </div>

            <div className="flex justify-center mt-2 w-full px-4 mb-12">
              <DetailsBlock
                title="Specifics"
                details={[
                  { label: 'Last updated', value: '23 Oct 2023' },
                  { label: 'Number of recommendations', value: 23 },
                  { label: 'Category', value: 'Travel' },
                ]}
              />
            </div>
          </div>

          {/* Fixed Chevron Buttons at the bottom */}
          <div
            className="fixed flex justify-between items-center px-6"
            style={{
              width: '100%',
              maxWidth: '580px',
              bottom: '20px', // Keep the buttons near the bottom
              left: '50%',
              transform: 'translateX(-50%)', // Center the buttons horizontally
            }}
          >
            {/* Left button */}
            <button
              onClick={() => console.log('Left button clicked')}
              className="bg-[#F8F8F8] bg-opacity-80 py-3 px-3 text-black font-poppins rounded-full transition transform active:scale-95 active:shadow-none duration-200"
              style={{
                width: '50px',
                height: '50px',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.15)',
              }}
            >
              <FaChevronLeft className="text-black h-6 w-6" />
            </button>

            {/* Right button */}
            <button
              onClick={() => console.log('Right button clicked')}
              className="bg-[#F8F8F8] bg-opacity-80 py-3 px-3 text-black font-poppins rounded-full transition transform active:scale-95 active:shadow-none duration-200"
              style={{
                width: '50px',
                height: '50px',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.15)',
              }}
            >
              <FaChevronRight className="text-black h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoToPage;
