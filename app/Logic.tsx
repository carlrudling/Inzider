'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Make sure this is imported
import LandingPage from './components/pages/LandingPage';
import GoToPage from './components/pages/GoToPage';
import CreatorLandingPage from './components/pages/CreatorLandingPage';
import AboutGoToPage from './components/pages/AboutGoToPage';
import TripBrowsePage from './components/pages/TripBrowsePage';
import AboutTripPage from './components/pages/AboutTripPage';
import SignupForm from './components/pages/SignUpForm';
import SigninForm from './components/pages/SignInForm';
import CreatorPage from './components/pages/CreatorPage';
import LoadingPage from './components/pages/LoadingPage';

const Logic: React.FC = () => {
  const { data: session, status } = useSession(); // Session data and status from next-auth
  const [currentPage, setCurrentPage] = useState('start'); // State for managing page navigation

  // Function to handle navigation by setting a hash in the URL
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page; // Set the URL hash
    }
  };

  // Effect to handle changes in the hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentPage(hash); // Sync the page state with the URL hash
    }
  }, []);

  // Effect to check if the user is authenticated and navigate to CreatorLandingPage
  useEffect(() => {
    // If the user is authenticated (there is a session), navigate to CreatorLandingPage
    if (status === 'authenticated') {
      handleNavigate('CreatorPage'); // Use your existing onNavigate function to navigate
    }
  }, [session, status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hashParts = window.location.hash.replace('#', '').split(':');
        const newPage = hashParts[0] || 'start';

        setCurrentPage(newPage);
      };

      window.addEventListener('hashchange', handleHashChange);
      handleHashChange();

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
  }, []);
  // Function to render the appropriate page based on current state and session status
  const renderPage = () => {
    if (status === 'loading') {
      return <LoadingPage />; // Show a loading state when session status is loading
    }

    switch (currentPage) {
      case 'landingpage':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'loading':
        return <LoadingPage />; // Show a loading state when session status is loading
      // Add other cases for different pages if needed
      case 'GoToPage':
        return <GoToPage onNavigate={handleNavigate} />;
      case 'CreatorLandingPage':
        return <CreatorLandingPage />;
      case 'AboutGoToPage':
        return <AboutGoToPage onNavigate={handleNavigate} />;
      case 'TripBrowsePage':
        return <TripBrowsePage onNavigate={handleNavigate} />;
      case 'AboutTripPage':
        return <AboutTripPage onNavigate={handleNavigate} />;
      case 'SignupForm':
        return <SignupForm onNavigate={handleNavigate} />;
      case 'SigninForm':
        return <SigninForm onNavigate={handleNavigate} />;
      case 'CreatorPage':
        return <CreatorPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />; // Handle unknown pages
    }
  };

  return <div>{renderPage()}</div>;
};

export default Logic;
