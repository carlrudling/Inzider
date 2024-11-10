import React, { useRef, useEffect, useState } from 'react';
import Nav from '../Nav';
import GoToCard from '../GoToCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { BiStats } from 'react-icons/bi';
import { IoPeople } from 'react-icons/io5';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // First section scroll handling
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  const [showLeftButton1, setShowLeftButton1] = useState(false);
  const [showRightButton1, setShowRightButton1] = useState(true);

  const handleScroll1 = () => {
    if (scrollContainerRef1.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef1.current;
      setShowLeftButton1(scrollLeft > 0);
      setShowRightButton1(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft1 = () => {
    if (scrollContainerRef1.current) {
      scrollContainerRef1.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight1 = () => {
    if (scrollContainerRef1.current) {
      scrollContainerRef1.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Second section scroll handling
  const scrollContainerRef2 = useRef<HTMLDivElement>(null);
  const [showLeftButton2, setShowLeftButton2] = useState(false);
  const [showRightButton2, setShowRightButton2] = useState(true);

  const handleScroll2 = () => {
    if (scrollContainerRef2.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef2.current;
      setShowLeftButton2(scrollLeft > 0);
      setShowRightButton2(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft2 = () => {
    if (scrollContainerRef2.current) {
      scrollContainerRef2.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight2 = () => {
    if (scrollContainerRef2.current) {
      scrollContainerRef2.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Initial check on mount for both sections
    handleScroll1();
    handleScroll2();

    // Attach scroll event listeners
    const scrollContainer1 = scrollContainerRef1.current;
    const scrollContainer2 = scrollContainerRef2.current;
    scrollContainer1?.addEventListener('scroll', handleScroll1);
    scrollContainer2?.addEventListener('scroll', handleScroll2);

    // Cleanup event listeners on unmount
    return () => {
      scrollContainer1?.removeEventListener('scroll', handleScroll1);
      scrollContainer2?.removeEventListener('scroll', handleScroll2);
    };
  }, []);

  const goToCardsData = [
    {
      title: 'Nights out in London',
      description:
        'Find out all my secret spots for eating in London. Many of these places I can’t go a few days without.',
      imageUrl: 'https://via.placeholder.com/150',
      country: 'London',
      tag: 'Updated',
      stars: 4,
      navigateTo: 'LondonDetails',
    },
    {
      title: 'Thrift shops in Paris',
      description:
        'Find out all my favorite thrift shops in Paris. I have found so many nice finds at these places.',
      imageUrl: 'https://via.placeholder.com/150',
      country: 'Paris',
      tag: 'Trending',
      stars: 3,
      navigateTo: 'ParisDetails',
    },
    {
      title: 'Eating in Mexico',
      description:
        'All my dreamy food places I discovered after my 4-month travels in Mexico. You’ve never tasted taco like this!',
      imageUrl: 'https://via.placeholder.com/150',
      country: 'Mexico',
      tag: 'Hot',
      stars: 5,
      navigateTo: 'MexicoDetails',
    },
    {
      title: 'Brunches for champs',
      description:
        'These are all my go-to brunch places in Stockholm that I have spent endless time at with friends, and the food is amazing!',
      imageUrl: 'https://via.placeholder.com/150',
      country: 'Stockholm',
      tag: 'New',
      stars: 4,
      navigateTo: 'StockholmDetails',
    },
  ];
  return (
    <div>
      <section className="min-h-6000 bg-white px-4 md:px-10 py-8">
        {/* Navigation component */}
        <Nav onNavigate={onNavigate} isWhiteText={false} />

        <div className="flex flex-col md:flex-row mt-10">
          {/* Profile Section */}
          <div className="w-full md:w-1/4 flex flex-col items-center text-center mb-10 md:mb-0">
            <img
              src="https://via.placeholder.com/100" // Replace with your actual image path
              alt="Profile"
              className="rounded-full w-24 h-24 mb-4"
            />
            <h2 className="text-xl font-poppins">Joseph Garcia</h2>
            <div className="flex space-x-10 mt-4">
              {/* Packages Section */}
              <div className="flex flex-col items-center text-center">
                {/* Icon with Background */}
                <div className="bg-custom-white-red rounded-lg mb-2">
                  <BiStats className="w-10 h-10 p-2 text-custom-red" />
                </div>
                {/* Number and Label */}
                <span className="text-custom-red text-lg font-semibold">
                  17
                </span>
                <p className="text-text-color2 font-semibold text-xs">
                  packages
                </p>
              </div>

              {/* Buyers Section */}
              <div className="flex flex-col items-center text-center">
                {/* Icon with Background */}
                <div className=" rounded-lg mb-2 bg-custom-white-purple">
                  <IoPeople className="w-10 h-10 p-2 text-custom-purple" />
                </div>
                {/* Number and Label */}
                <span className="text-lg font-semibold text-custom-purple">
                  347
                </span>
                <p className="text-text-color2 font-semibold text-xs">Buyers</p>
              </div>
            </div>
          </div>

          {/* Right Section with Cards */}
          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trips Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Trips</h3>
              <p className="text-gray-500 mt-2">
                Trip itineraries are personalized itineraries loaded with your
                tips, photos, and videos, allowing your followers to travel in
                your footsteps.
              </p>
              <button
                onClick={() => onNavigate('CreateTripPage')}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded"
              >
                Create Trip
              </button>
            </div>

            {/* Go-Tos Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Go-Tos</h3>
              <p className="text-gray-500 mt-2">
                Go-To collections are curated packages of your favorite places,
                packed with recommendations, photos, and insights.
              </p>
              <button
                onClick={() => onNavigate('CreateGoTo')}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded"
              >
                Create Go-To
              </button>
            </div>

            {/* Landing Page Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Landing Page</h3>
              <p className="text-gray-500 mt-2">
                Showcase all your Trips and Go-To Packages with a Landing Page.
                It lets your followers easily browse your curated adventures.
              </p>
              <button
                onClick={() => onNavigate('EditLandingPage')}
                className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded"
              >
                Edit Landing Page
              </button>
            </div>

            {/* Account Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Account</h3>
              <p className="text-gray-500 mt-2">
                Change your account settings.
              </p>
              <button
                onClick={() => onNavigate('EditAccount')}
                className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded"
              >
                Edit Account
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* First scrollable section */}
      <section className="my-12">
        <h2 className="text-2xl pt-10 font-poppins italic mb-6 ml-10 text-text-color1">
          My Go-Tos
        </h2>
        <div className="relative">
          {showLeftButton1 && (
            <button
              onClick={scrollLeft1}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <FaChevronLeft size={20} />
            </button>
          )}
          <div
            className="overflow-x-scroll pb-10 pl-10 pr-10"
            ref={scrollContainerRef1}
          >
            <div className="flex space-x-4 whitespace-nowrap">
              {goToCardsData.map((card, index) => (
                <GoToCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  country={card.country}
                  tag={card.tag}
                  stars={card.stars}
                  onNavigate={onNavigate}
                  navigateTo={card.navigateTo}
                />
              ))}
            </div>
          </div>
          {showRightButton1 && (
            <button
              onClick={scrollRight1}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </section>
      {/* Second scrollable section */}
      <section className="my-12">
        <h2 className="text-2xl pt-10 font-poppins italic mb-6 ml-10 text-text-color1">
          Popular Destinations
        </h2>
        <div className="relative">
          {showLeftButton2 && (
            <button
              onClick={scrollLeft2}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <FaChevronLeft size={20} />
            </button>
          )}
          <div
            className="overflow-x-scroll pb-10 pl-10 pr-10"
            ref={scrollContainerRef2}
          >
            <div className="flex space-x-4 whitespace-nowrap">
              {goToCardsData.map((card, index) => (
                <GoToCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  country={card.country}
                  tag={card.tag}
                  stars={card.stars}
                  onNavigate={onNavigate}
                  navigateTo={card.navigateTo}
                />
              ))}
            </div>
          </div>
          {showRightButton2 && (
            <button
              onClick={scrollRight2}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <FaChevronRight size={20} />
            </button>
          )}
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

export default HomePage;
