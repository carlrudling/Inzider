'use client';
import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { LuLink } from 'react-icons/lu';
import { FaMoneyCheck } from 'react-icons/fa';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { FaInstagram } from 'react-icons/fa';
import { BiLogoTiktok } from 'react-icons/bi';
import { PiXLogo } from 'react-icons/pi';
import { RiYoutubeFill } from 'react-icons/ri';
import { LuCopy } from 'react-icons/lu';
import Nav from '../../../components/Nav';
import { useCreatorData } from '../../../provider/CreatorProvider';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import StripeConnectButton from '@/components/StripeConnectButton';

const SettingsPage = () => {
  const { data: session } = useSession();
  const { creatorData, loading } = useCreatorData();
  const [selectedTab, setSelectedTab] = useState('Profile');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        No creator data found.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="absolute top-0 left-0 w-full">
        <Nav isWhiteText={false} />
      </div>
      {/* Left Navigation */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-6 flex-shrink-0 overflow-hidden">
        <nav className="space-y-6 mt-20 z-10">
          {['Profile', 'Connect', 'Payments & Billing', 'Support'].map(
            (tab) => (
              <button
                key={tab}
                className={`flex items-center space-x-3 text-gray-700 font-medium hover:text-blue-500 focus:outline-none w-full ${
                  selectedTab === tab ? 'text-blue-500 font-bold' : ''
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                <span>
                  {tab === 'Profile' ? (
                    <CgProfile />
                  ) : tab === 'Connect' ? (
                    <LuLink />
                  ) : tab === 'Payments & Billing' ? (
                    <FaMoneyCheck />
                  ) : (
                    <IoHelpCircleOutline />
                  )}
                </span>
                <span className="whitespace-normal">{tab}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto mt-16">
        {selectedTab === 'Payments & Billing' && (
          <>
            <h1 className="text-2xl font-bold mb-6">Payments & Billing</h1>
            <div className="max-w-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">
                  Connect with Stripe
                </h2>
                <p className="text-gray-600 mb-4">
                  To receive payments for your trips and go-tos, you need to
                  connect your Stripe account. This allows us to securely
                  process payments and transfer your earnings directly to your
                  bank account.
                </p>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Payment Processing</p>
                    <p className="text-sm text-gray-500">
                      Stripe handles all payments securely
                    </p>
                  </div>
                  {creatorData.stripeAccountId ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Connected</span>
                    </div>
                  ) : (
                    <>
                      <StripeConnectButton />
                      {error === 'already_connected' && (
                        <p className="mt-2 text-sm text-red-600">
                          This account is already connected to Stripe.
                        </p>
                      )}
                      {error === 'user_denied' && (
                        <p className="mt-2 text-sm text-red-600">
                          Connection was cancelled. Please try again.
                        </p>
                      )}
                      {error === 'stripe_error' && (
                        <p className="mt-2 text-sm text-red-600">
                          There was an error connecting to Stripe. Please try
                          again.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>• Secure payment processing</p>
                  <p>• Automatic transfers to your bank account</p>
                  <p>• 80% revenue share (20% platform fee)</p>
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            '/api/stripe/reset-connection',
                            {
                              method: 'POST',
                            }
                          );
                          if (response.ok) {
                            window.location.reload();
                          }
                        } catch (error) {
                          console.error('Error resetting connection:', error);
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Reset Stripe Connection (Development Only)
                    </button>
                  </div>
                )}
              </div>

              {creatorData.stripeAccountId && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4">
                    Payment History
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Total Earnings</p>
                        <p className="text-sm text-gray-500">All time</p>
                      </div>
                      <p className="text-lg font-semibold">$0.00</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Pending Transfers</p>
                        <p className="text-sm text-gray-500">Processing</p>
                      </div>
                      <p className="text-lg font-semibold">$0.00</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View full payment history →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
