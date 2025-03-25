'use client';
import React, { useState, useEffect, Suspense } from 'react';
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
import dynamic from 'next/dynamic';

const DynamicLoader = dynamic(() => import('@/components/Loader'), {
  ssr: false,
});

const SettingsContent = () => {
  const { data: session } = useSession();
  const { creatorData, loading } = useCreatorData();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // All useState hooks grouped together
  const [selectedTab, setSelectedTab] = useState('Profile');
  const [mounted, setMounted] = useState(false);
  const [refundForm, setRefundForm] = useState({
    buyerEmail: '',
    contentType: '',
    contentTitle: '',
    reason: '',
  });
  const [refundStatus, setRefundStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundHistory, setRefundHistory] = useState<
    Array<{
      id: string;
      buyerEmail: string;
      contentTitle: string;
      contentType: string;
      amount: number;
      currency: string;
      reason: string;
      refundedAt: string;
    }>
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState('');
  const [username, setUsername] = useState('');
  const [creatorDescription, setCreatorDescription] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [xLink, setXLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Function declarations
  const fetchRefundHistory = async () => {
    if (!session?.user?.id) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/creators/${session.user.id}/refunds`);
      if (response.ok) {
        const data = await response.json();
        setRefundHistory(data);
      }
    } catch (error) {
      console.error('Error fetching refund history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // All useEffect hooks grouped together
  useEffect(() => {
    if (creatorData) {
      setProfileImage(creatorData.profileImage || null);
      setCreatorName(creatorData.name || '');
      setUsername(creatorData.username || '');
      setCreatorDescription(creatorData.description || '');
      setInstagramLink(creatorData.instagram || '');
      setXLink(creatorData.xLink || '');
      setTiktokLink(creatorData.tiktok || '');
      setYoutubeLink(creatorData.youtube || '');
      setCurrentEmail(creatorData.email || '');
    }
  }, [creatorData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchRefundHistory();
  }, [session?.user?.id]); // Added proper dependency

  if (!mounted || loading) {
    return mounted ? (
      <DynamicLoader fullScreen={false} />
    ) : (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!creatorData) {
    return mounted ? (
      <DynamicLoader fullScreen={false} />
    ) : (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Handle refund form input changes
  const handleRefundInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setRefundForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle refund form submission
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setRefundStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerEmail: refundForm.buyerEmail,
          contentType: refundForm.contentType,
          contentTitle: refundForm.contentTitle,
          reason: refundForm.reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to process refund';

        // Provide specific error messages based on the response status
        switch (response.status) {
          case 404:
            if (data.error === 'Buyer not found') {
              errorMessage = `No user found with email ${refundForm.buyerEmail}`;
            } else if (data.error === 'Content not found') {
              errorMessage = `No ${refundForm.contentType} found with title "${refundForm.contentTitle}"`;
            } else if (
              data.error === 'No completed purchase found for this content'
            ) {
              errorMessage = `No completed purchase found for ${refundForm.contentTitle} by ${refundForm.buyerEmail}. The purchase might be pending, already refunded, or was a manual payment.`;
            }
            break;
          case 403:
            errorMessage = 'You are not authorized to refund this purchase';
            break;
          case 400:
            if (data.error === 'Cannot refund manual purchases') {
              errorMessage =
                'Manual purchases cannot be refunded through the system';
            } else if (data.error?.includes('reason')) {
              errorMessage = 'Please provide a reason for the refund';
            }
            break;
          case 401:
            errorMessage =
              'You must be logged in as a creator to process refunds';
            break;
          case 500:
            errorMessage =
              data.error ||
              'An unexpected error occurred while processing the refund';
            break;
        }

        throw new Error(errorMessage);
      }

      // Success case
      setRefundStatus({
        type: 'success',
        message:
          'Refund processed successfully! The refund will appear in the history below.',
      });
      setRefundForm({
        buyerEmail: '',
        contentType: '',
        contentTitle: '',
        reason: '',
      });
      // Refresh the refund history
      fetchRefundHistory();
    } catch (error) {
      setRefundStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to process refund',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload the file to R2
  const handleProfileImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Upload failed');
      return null;
    }

    const { fileUrl } = await res.json();
    return fileUrl as string;
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = await handleProfileImageUpload(file);
      if (fileUrl) {
        setProfileImage(fileUrl);
      }
    }
  };

  // Handle email change
  const handleEmailChange = async () => {
    if (!session?.user?.id) return;
    if (newEmail !== confirmNewEmail) {
      alert('New email and confirmation email do not match.');
      return;
    }

    try {
      const res = await fetch(`/api/creators/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });
      if (!res.ok) {
        console.error('Failed to update email');
        return;
      }
      alert('Email successfully changed!');
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!session?.user?.id) return;
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirmation password do not match.');
      return;
    }
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }

    try {
      const res = await fetch(`/api/creators/${session.user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.status === 401) {
        alert('Current password is incorrect.');
        return;
      }

      if (!res.ok) {
        alert('Failed to update password. Please try again.');
        return;
      }

      // Clear password fields after successful update
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert('Password successfully changed!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  // Handle saving general profile changes
  const handleSaveChanges = async () => {
    if (!session?.user?.id) return;
    const updatedData = {
      name: creatorName,
      username: username,
      description: creatorDescription,
      instagram: instagramLink,
      xLink: xLink,
      tiktok: tiktokLink,
      youtube: youtubeLink,
      profileImage: profileImage || '',
    };

    try {
      const res = await fetch(`/api/creators/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Failed to update creator profile');
        return;
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

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
        {selectedTab === 'Profile' && (
          <>
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <p className="text-xs italic text-gray-600 mb-10">
              Changes will affect your landing page
            </p>

            {/* Profile Section */}
            <section className="mb-8">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span>Image</span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="upload-profile-image"
                />
                <label
                  htmlFor="upload-profile-image"
                  className="text-blue-500 text-sm font-medium self-center hover:underline cursor-pointer"
                >
                  Change image
                </label>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-700">
                    About me
                  </label>
                  <textarea
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    rows={3}
                    value={creatorDescription}
                    onChange={(e) => setCreatorDescription(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 flex items-center space-x-2">
                    <FaInstagram />
                    <span>Instagram</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 flex items-center space-x-2">
                    <PiXLogo />
                    <span>X (Twitter)</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={xLink}
                    onChange={(e) => setXLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 flex items-center space-x-2">
                    <BiLogoTiktok />
                    <span>Tiktok</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={tiktokLink}
                    onChange={(e) => setTiktokLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 flex items-center space-x-2">
                    <RiYoutubeFill />
                    <span>Youtube</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <button
              onClick={handleSaveChanges}
              className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </>
        )}

        {selectedTab === 'Connect' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Connect</h1>
            <p className="text-[#1C1C1C] mb-6">
              You can self choose how you share your packages with your
              customers, but we recommend sharing your landing page in your
              social media bios. If you already have a link service and would
              rather set up buttons there to your GoTos or trips, you can do
              that by copying the URLs to the browseTrips page and browseGoTos
              page.
            </p>

            <div className="space-y-4">
              {/* Landing Page */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] italic mb-2">
                  Landingpage
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value={`www.inzider.io/${creatorData?.username || ''}`}
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `www.inzider.io/${creatorData?.username || ''}`
                      )
                    }
                    className="ml-2 text-[#1C1C1C] hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>

              {/* BrowseTrips Page */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] italic mb-2">
                  BrowseTrips page
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value={`www.inzider.io/${
                      creatorData?.username || ''
                    }/trips`}
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `www.inzider.io/${creatorData?.username || ''}/trips`
                      )
                    }
                    className="ml-2 text-[#1C1C1C] hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>

              {/* BrowseGoTos Page */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] italic mb-2">
                  BrowseGoTos page
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value={`www.inzider.io/${
                      creatorData?.username || ''
                    }/gotos`}
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `www.inzider.io/${creatorData?.username || ''}/gotos`
                      )
                    }
                    className="ml-2 text-[#1C1C1C] hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'Support' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Support</h1>
            <p className="text-gray-600 mb-6">
              If you run into any issues, have feature suggestions or other
              questions please{' '}
              <a
                href="mailto:help.inzider@gmail.com"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                send an email to help.inzider@gmail.com
              </a>{' '}
              and we will respond as quickly as possible. Please keep in mind
              that this is a beta version and may include some bugs.
            </p>
          </>
        )}

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
                <>
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

                  <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Issue Refund</h2>
                    <p className="text-gray-600 mb-4">
                      Process refunds for your customers. Enter the buyer's
                      email and the content details below.
                    </p>

                    {refundStatus.type && (
                      <div
                        className={`mb-4 p-4 rounded-md ${
                          refundStatus.type === 'success'
                            ? 'bg-green-50 text-green-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {refundStatus.message}
                      </div>
                    )}

                    <form onSubmit={handleRefundSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="buyerEmail"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Buyer's Email
                        </label>
                        <input
                          type="email"
                          id="buyerEmail"
                          value={refundForm.buyerEmail}
                          onChange={handleRefundInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter buyer's email"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contentType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Content Type
                        </label>
                        <select
                          id="contentType"
                          value={refundForm.contentType}
                          onChange={handleRefundInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select content type</option>
                          <option value="goto">GoTo</option>
                          <option value="trip">Trip</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="contentTitle"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Content Title
                        </label>
                        <input
                          type="text"
                          id="contentTitle"
                          value={refundForm.contentTitle}
                          onChange={handleRefundInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter content title"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Reason for Refund
                        </label>
                        <textarea
                          id="reason"
                          value={refundForm.reason}
                          onChange={handleRefundInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter reason for refund"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Process Refund'}
                      </button>
                    </form>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                      Refund History
                    </h2>
                    {isLoadingHistory ? (
                      <p>Loading refund history...</p>
                    ) : refundHistory.length === 0 ? (
                      <p>No refunds processed yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Buyer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reason
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {refundHistory.map((refund) => (
                              <tr key={refund.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    refund.refundedAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {refund.buyerEmail}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {refund.contentTitle} ({refund.contentType})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {refund.amount} {refund.currency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {refund.reason}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
};

export default SettingsPage;
