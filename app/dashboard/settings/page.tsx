'use client';
import React, { useState, useEffect } from 'react';
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
import { useCreatorData } from '../../../provider/CreatorProvider'; // Import the hook
import { useSession } from 'next-auth/react';

const SettingsPage = () => {
  const { data: session } = useSession();
  const { creatorData, loading } = useCreatorData();
  const [selectedTab, setSelectedTab] = useState('Profile'); // Tracks active tab

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

  // Creator profile fields (derived from creatorData)
  const [profileImage, setProfileImage] = useState<string | null>(
    creatorData.profileImage || null
  );
  const [creatorName, setCreatorName] = useState(creatorData.name || '');
  const [username, setUsername] = useState(creatorData.username || '');
  const [creatorDescription, setCreatorDescription] = useState(
    creatorData.description || ''
  );
  const [instagramLink, setInstagramLink] = useState(
    creatorData.instagram || ''
  );
  const [xLink, setXLink] = useState(creatorData.xLink || '');
  const [tiktokLink, setTiktokLink] = useState(creatorData.tiktok || '');
  const [youtubeLink, setYoutubeLink] = useState(creatorData.youtube || '');

  // Email & password fields
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const creatorId = session?.user?.id; // Adjust if needed

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
      // Upload the file to R2 and get a URL
      const fileUrl = await handleProfileImageUpload(file);
      if (fileUrl) {
        setProfileImage(fileUrl);
      }
    }
  };

  // Handle email change
  const handleEmailChange = async () => {
    if (!creatorId) return;
    if (newEmail !== confirmNewEmail) {
      alert('New email and confirmation email do not match.');
      return;
    }

    try {
      const res = await fetch(`/api/creators/${creatorId}`, {
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
    if (!creatorId) return;
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirmation password do not match.');
      return;
    }

    try {
      const res = await fetch(`/api/creators/${creatorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) {
        console.error('Failed to update password');
        return;
      }
      alert('Password successfully changed!');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  // Handle saving general profile changes
  const handleSaveChanges = async () => {
    // Since we've already uploaded the image and have `profileImage` as a URL,
    // we just include it in the PUT request.
    if (!creatorId) return;
    const updatedData = {
      name: creatorName,
      username: username,
      description: creatorDescription,
      instagram: instagramLink,
      xLink: xLink,
      tiktok: tiktokLink,
      youtube: youtubeLink,
      profileImage: profileImage || '', // Include the image URL
    };

    try {
      const res = await fetch(`/api/creators/${creatorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        console.error('Failed to update creator profile');
        return;
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
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
      <main className="flex-grow p-8 overflow-y-auto">
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

            {/* Email & Password Section */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Email & Password</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-700">
                    Current email
                  </label>
                  {/* Replace with actual current email field if needed */}
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    New email
                  </label>
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Confirm new email
                  </label>
                  <input
                    type="text"
                    value={confirmNewEmail}
                    onChange={(e) => setConfirmNewEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  onClick={handleEmailChange}
                  className="col-span-3 bg-blue-500 text-white py-2 w-40 rounded-md"
                >
                  Update Email
                </button>
                <div>
                  <label className="block text-sm text-gray-700">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm  text-gray-700">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="col-span-3 bg-green-500 text-white py-2 w-40 mb-8 rounded-md"
                >
                  Update Password
                </button>
              </div>
              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </section>
          </>
        )}

        {selectedTab === 'Connect' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Connect</h1>
            <p className="text-text-color2 mb-6">
              You can self choose how you share your packages with your
              customers, but we recommend sharing your landing page in your
              social media bios. If you already have a link service and would
              rather set up buttons to your GoTos or trips, you can do that by
              copying the URLs to the browseTrips page and browseGoTos page.
            </p>

            <div className="space-y-4">
              {/* Landing Page */}
              <div>
                <label className="block text-sm font-medium text-text-color2 italic mb-2">
                  Landingpage
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value="www.inzider.io/JosephGarcia"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        'www.inzider.io/JosephGarcia'
                      )
                    }
                    className="ml-2 text-text-color2 hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>

              {/* BrowseTrips Page */}
              <div>
                <label className="block text-sm font-medium text-text-color2 italic mb-2">
                  BrowseTrips page
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value="www.inzider.io/JosephGarcia/trips"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        'www.inzider.io/JosephGarcia/trips'
                      )
                    }
                    className="ml-2 text-text-color2 hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>

              {/* BrowseGoTos Page */}
              <div>
                <label className="block text-sm font-medium text-text-color2 italic mb-2">
                  BrowseGoTos page
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2">
                  <input
                    type="text"
                    readOnly
                    className="bg-transparent flex-grow text-gray-800 font-semibold focus:outline-none"
                    value="www.inzider.io/JosephGarcia/gotos"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        'www.inzider.io/JosephGarcia/gotos'
                      )
                    }
                    className="ml-2 text-text-color2 hover:text-blue-700 focus:outline-none"
                  >
                    <LuCopy />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'Payments & Billing' && (
          <>
            <h1 className="text-2xl font-bold mb-6">Payments & Billing</h1>
            {/* Add your Payments & Billing tab content */}
            <p>Manage your payments and billing information.</p>
          </>
        )}

        {selectedTab === 'Support' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Support</h1>
            <p className="text-gray-600 mb-6">
              We’re a small team dedicated to improving your experience, and
              we’re currently focused on development. As a result, our support
              response times may be a bit slower. For faster assistance, please
              check out our tutorial videos on our YouTube channel!
            </p>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mb-8 inline-block"
            >
              Link to youtube channel
            </a>

            <p className="text-gray-600 mt-6 mb-4">
              Didn’t find your answer? Then write to our support mail and we
              will respond as quick as possible.
            </p>

            <form className="space-y-4">
              {/* Topic Field */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Topic
                </label>
                <div className="flex items-center border border-gray-300 rounded-md bg-white p-2">
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    className="w-full focus:outline-none bg-transparent"
                    placeholder="Errors when upload"
                  />
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14m7-7H5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md focus:outline-none bg-white p-2"
                  placeholder="Describe your issue here..."
                >
                  I am a London girl who enjoys good food, nights out and
                  finding new hidden gems
                </textarea>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-md font-medium hover:bg-purple-600 transition"
              >
                Send
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
