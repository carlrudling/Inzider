'use client';
import React from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import GoToCard from '../../components/Card';
import { BiSolidCircle } from 'react-icons/bi';
import Lightbulb from '@/utils/icons/Lightbulb';
import Coin from '@/utils/icons/Coin';
import Gear from '@/utils/icons/Gear';
import { FaInstagram } from 'react-icons/fa';

interface landingPageProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

const LandingPage: React.FC<landingPageProps> = ({
  title = 'Create, sell and share your Go-to places and travel itineraries',
  description = 'Put a link in your bio to your go-tos and start sharing and selling your favorite spots today.',
  buttonText = 'Get Started',
}) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center text-white bg-cover bg-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/landingPageVideo.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute w-full top-0">
          <Nav isWhiteText={true} />
        </div>
        <div className="relative z-10 flex flex-col items-center space-y-4 text-center px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-lg font-light font-satoshi text-white opacity-90">
            {description}
          </p>
          <Link
            href="/auth/signup"
            className="px-6 py-3 font-semibold text-white font-satoshi bg-custom-purple rounded-full hover:scale-105 hover:shadow-lg transition transform active:scale-95 active:shadow-none duration-200"
          >
            {buttonText}
          </Link>
        </div>
      </section>

      {/* Card Section */}
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center py-16 bg-[#E1F1F1]">
        <h2 className="text-lg md:text-xl lg:text-xl lg:text-left md:text-left text-center mb-10 md:mb-0 lg:mb-0 font-satoshi mx-20 text-black w-80">
          Share your best memories with your followers and let them to live in
          your footsteps
        </h2>
        <div className="flex flex-col items-center mx-20 space-y-10">
          <GoToCard
            title="Drinks in San Sebastian"
            description="Having gone out in San Sebastian for most of my adult life I have now made a list of all the best spots that you don't want to miss."
            imageUrl="/images/drinksSansebastian.jpg"
            country="Portugal"
            tag="Preview"
            stars={4}
            navigateTo="/about-goto"
          />
          <p className="max-w-3xl mb-6 font-light italic">Preview</p>
        </div>
      </section>

      {/* White Divider Section */}
      <section className="flex flex-col items-center justify-center py-24 bg-white">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-8">
          <span className="text-text-color1">Easy</span>
          <span className="text-gray-300">|</span>
          <span className="text-text-color1">Profitable</span>
          <span className="text-gray-300">|</span>
          <span className="text-text-color1">Personalised</span>
        </h2>
      </section>

      {/* Easy Section */}
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center gap-60 py-32 min-h-[600px] bg-[#FEF4DF] text-center text-gray-800">
        <div className="flex justify-center">
          <Lightbulb
            width="100"
            height="100"
            className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
          />
        </div>
        <div className="text-left max-w-md">
          <h2 className="text-xl md:text-2xl font-satoshi font-semibold mb-4">
            Easy
          </h2>
          <p className="text-sm md:text-lg lg:text-lg mb-6 font-light w-80">
            Making it easy for everyone: Customers can find your packages
            directly through a simple link in your bio. For creators, setting up
            and managing trips is quick and hassle-free, saving you time and
            energy.
          </p>
        </div>
      </section>

      {/* White Section - A new way */}
      <section className="flex flex-col items-center justify-center bg-white py-24 text-center text-black">
        <h2 className="text-xl lg:text-3xl md:text-3xl font-satoshi font-semibold">
          A new way to interact with your followers
        </h2>
      </section>

      {/* Profitable Section */}
      <section className="flex lg:flex-row-reverse md:flex-row-reverse flex-col items-center justify-center gap-60 py-32 min-h-[600px] bg-[#E7ECE4] text-center text-gray-800">
        <div className="flex justify-center">
          <Coin
            width="100"
            height="100"
            className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
          />
        </div>
        <div className="text-left max-w-md">
          <h2 className="text-xl md:text-3xl font-satoshi font-semibold mb-4">
            Profitable
          </h2>
          <p className="text-md md:text-xl lg:text-xl mb-6 font-light w-80">
            You set your own price. After Stripe processing fees and our 20%
            service cut, you keep the rest—no hidden costs.
          </p>
        </div>
      </section>

      {/* White Section - Join */}
      <section className="flex flex-col items-center justify-center bg-white py-24 text-center text-black">
        <h2 className="text-xl lg:text-3xl md:text-3xl font-satoshi font-semibold mb-10">
          Join a movement of creatives shaping the future of travel
        </h2>
        <Link
          href="/auth/signup"
          className="px-6 py-3 font-semibold text-black font-satoshi bg-[#E1F1F1] rounded-full hover:scale-105 hover:shadow-lg transition transform active:scale-95 active:shadow-none duration-200"
        >
          Join
        </Link>
      </section>

      {/* Personalised Section */}
      <section className="flex lg:flex-row md:flex-row flex-col items-center justify-center gap-60 py-32 min-h-[600px] bg-[#D7C49F] text-center text-gray-800">
        <div className="flex justify-center">
          <Gear
            width="100"
            height="100"
            className="sm:w-30 sm:h-30 md:w-40 md:h-40 lg:w-40 lg:h-40"
          />
        </div>
        <div className="text-left max-w-md">
          <h2 className="text-xl md:text-3xl font-satoshi font-semibold mb-4">
            Personalised
          </h2>
          <p className="text-md md:text-xl lg:text-xl mb-6 font-light w-80">
            Fully personalize your trip itineraries and packages with a simple
            drag-and-drop interface, making it easy to tailor the experience to
            your audience.
          </p>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-center py-16 bg-[#2E334A] text-center text-gray-800">
        <div className="sm:items-center sm:justify-between">
          <h2 className="self-center logo_text whitespace-nowrap dark:text-white mb-4">
            Inzider
          </h2>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link
                href="/user-agreement"
                className="hover:underline me-4 md:me-6"
              >
                User Agreement
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:underline me-4 md:me-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
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

        <FaInstagram className="w-6 h-6 mt-2 text-gray-500 dark:text-gray-400 cursor-pointer" />
      </footer>
    </div>
  );
};

export default LandingPage;
