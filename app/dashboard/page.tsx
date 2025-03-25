'use client';
import React, { useRef, useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import GoToCard from '../../components/Card';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { BiStats } from 'react-icons/bi';
import { IoPeople } from 'react-icons/io5';
import Link from 'next/link';
import { useCreatorData } from '../../provider/CreatorProvider';
import Card from '../../components/Card';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';

const HomePage = () => {
  const { creatorData, loading } = useCreatorData();
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  const scrollContainerRef2 = useRef<HTMLDivElement>(null);
  const [goTos, setGoTos] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showLeftButton1, setShowLeftButton1] = useState(false);
  const [showRightButton1, setShowRightButton1] = useState(true);
  const [showLeftButton2, setShowLeftButton2] = useState(false);
  const [showRightButton2, setShowRightButton2] = useState(true);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScroll1 = () => {
    if (!isClient || !scrollContainerRef1.current) return;
    const { scrollLeft, scrollWidth, clientWidth } =
      scrollContainerRef1.current;
    setShowLeftButton1(scrollLeft > 0);
    setShowRightButton1(scrollLeft < scrollWidth - clientWidth);
  };

  const handleScroll2 = () => {
    if (!isClient || !scrollContainerRef2.current) return;
    const { scrollLeft, scrollWidth, clientWidth } =
      scrollContainerRef2.current;
    setShowLeftButton2(scrollLeft > 0);
    setShowRightButton2(scrollLeft < scrollWidth - clientWidth);
  };

  const scrollLeft1 = () => {
    if (scrollContainerRef1.current) {
      scrollContainerRef1.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight1 = () => {
    if (scrollContainerRef1.current) {
      scrollContainerRef1.current.scrollBy({ left: 300, behavior: 'smooth' });
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
    if (!isClient) return;
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
  }, [isClient]);

  useEffect(() => {
    const fetchGoTos = async () => {
      if (!creatorData) return;
      const query =
        (creatorData.myGotos?.length ?? 0) > 0
          ? `ids=${creatorData.myGotos.join(',')}`
          : `creatorId=${creatorData._id}`;

      const res = await fetch(`/api/gotos?${query}`, {
        method: 'GET',
      });

      const data = await res.json();
      console.log('=== DEBUG: Dashboard API response ===', data);
      setGoTos(data);
    };

    const fetchTrips = async () => {
      if (!creatorData) return;
      const query =
        (creatorData.myTrips?.length ?? 0) > 0
          ? `ids=${creatorData.myTrips.join(',')}`
          : `creatorId=${creatorData._id}`;

      const res = await fetch(`/api/trips?${query}`, {
        method: 'GET',
      });

      const data = await res.json();
      console.log('=== DEBUG: Dashboard Trips API response ===', data);
      setTrips(data);
    };

    fetchGoTos();
    fetchTrips();
  }, [creatorData]);

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!creatorData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow bg-white px-4 md:px-10 py-8">
        {/* Navigation component */}
        <div className="absolute top-0 z-20 left-0 w-full">
          <Nav isWhiteText={false} />
        </div>
        <div className="flex flex-col md:flex-row mt-20">
          {/* Profile Section */}
          <div className="w-full md:w-1/4 flex flex-col items-center text-center mb-10 md:mb-0">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={
                  creatorData.profileImage || 'https://via.placeholder.com/100'
                }
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="mt-10 text-xl font-satoshi">{creatorData.name}</h2>
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
              <Link
                className="inline-block mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded"
                href="/dashboard/create-trip"
              >
                Create Trip
              </Link>
            </div>

            {/* Go-Tos Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Go-Tos</h3>
              <p className="text-gray-500 mt-2">
                Go-To collections are curated packages of your favorite places,
                packed with recommendations, photos, and insights.
              </p>

              <Link
                className="inline-block mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded"
                href="/dashboard/create-goto"
              >
                Create Go-To
              </Link>
            </div>

            {/* Landing Page Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Landing Page</h3>
              <p className="text-gray-500 mt-2">
                Showcase all your Trips and Go-To Packages with a Landing Page.
                It lets your followers easily browse your curated adventures.
              </p>

              <Link
                className="inline-block mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded"
                href="/dashboard/create-landing"
              >
                Edit Landing Page
              </Link>
            </div>

            {/* Account Card */}
            <div className="border border-gray-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold">Account</h3>
              <p className="text-gray-500 mt-2">
                Change your account settings.
              </p>

              <Link
                className="inline-block mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded"
                href="/dashboard/settings"
              >
                Edit Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* First scrollable section */}
      <section className="my-12">
        <h2 className="text-2xl pt-10 font-satoshi italic mb-6 ml-10 text-text-color1">
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
            <div className="flex space-x-4">
              {goTos.map((goto, index) => {
                const firstSlide =
                  goto.slides && goto.slides.length > 0 ? goto.slides[0] : null;
                console.log('=== DEBUG: Dashboard Card props for', goto.title, {
                  goto,
                  firstSlide,
                  price: goto.price,
                  priceType: typeof goto.price,
                  currency: goto.currency,
                  currencyType: typeof goto.currency,
                });
                return (
                  <Card
                    key={index}
                    title={goto.title}
                    description={goto.description}
                    imageUrl={
                      firstSlide?.src || 'https://via.placeholder.com/150'
                    }
                    stars={goto.avgRating || 0}
                    price={goto.price}
                    currency={goto.currency}
                    navigateTo={`/dashboard/edit-goto/${goto._id}`}
                    mediaType={firstSlide?.type || 'image'}
                  />
                );
              })}
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
        <h2 className="text-2xl pt-10 font-satoshi italic mb-6 ml-10 text-text-color1">
          My Trips
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
            <div className="flex space-x-4">
              {trips.map((trip, index) => {
                const firstSlide =
                  trip.slides && trip.slides.length > 0 ? trip.slides[0] : null;
                console.log(
                  '=== DEBUG: Dashboard Card props for trip',
                  trip.title,
                  {
                    trip,
                    firstSlide,
                    price: trip.price,
                    priceType: typeof trip.price,
                    currency: trip.currency,
                    currencyType: typeof trip.currency,
                  }
                );
                return (
                  <Card
                    key={index}
                    title={trip.title}
                    description={trip.description}
                    imageUrl={
                      firstSlide?.src || 'https://via.placeholder.com/150'
                    }
                    stars={trip.avgRating || 0}
                    price={trip.price}
                    currency={trip.currency}
                    navigateTo={`/dashboard/edit-trip/${trip._id}`}
                    mediaType={firstSlide?.type || 'image'}
                  />
                );
              })}
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
      <Footer />
    </div>
  );
};

export default HomePage;
