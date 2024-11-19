'use client';
import React, { useState, useRef } from 'react';
import Nav from '../Nav';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CreatorLandingPage from './CreatorLandingPage';

interface CreateLandingPageProps {
  onNavigate: (page: string) => void;
}

const CreateLandingPage: React.FC<CreateLandingPageProps> = ({
  onNavigate,
}) => {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [creatorName, setCreatorName] = useState('');
  const [description, setDescription] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [buttonColor, setButtonColor] = useState('#726238'); // Default button color
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF'); // Default text color
  const [textColor, setTextColor] = useState('#FFFFFF'); // Default text color

  const handleBackgroundImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setBackgroundImage(event.target.files[0]);
    }
  };

  const handleProfileImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    console.log('Changes saved!');
    // Add your save logic here
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen bg-gray-100 flex">
        <div className="absolute top-0 left-0 w-full z-10">
          <Nav onNavigate={onNavigate} isWhiteText={false} />
        </div>

        <aside className="w-1/4 h-screen sticky top-20 bg-gray-50 p-8 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 mt-20">Edit Landing Page</h2>
          <div className="space-y-4">
            {/* Background Image */}
            <div>
              <label className="block text-gray-700">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md w-full mt-2"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-gray-700">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md w-full mt-2"
              />
            </div>

            {/* Creator Name */}
            <label className="block">
              <span className="text-gray-700">Creator Name</span>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
              />
            </label>

            {/* Description */}
            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            {/* Social Media Links */}
            <label className="block">
              <span className="text-gray-700">Instagram Link</span>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="https://instagram.com/yourprofile"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Twitter Link</span>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="https://twitter.com/yourprofile"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
              />
            </label>

            {/* Button Colors */}
            <label className="block">
              <span className="text-gray-700">Button Color</span>
              <input
                type="color"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Button Text Color</span>
              <input
                type="color"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={buttonTextColor}
                onChange={(e) => setButtonTextColor(e.target.value)}
              />
            </label>

            {/* Text Color */}
            <label className="block">
              <span className="text-gray-700">Text Color</span>
              <input
                type="color"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </label>
          </div>
        </aside>

        <main className="flex-grow p-8 overflow-y-auto h-screen">
          <div className="mt-20">
            <CreatorLandingPage
              backgroundImage={
                backgroundImage
                  ? URL.createObjectURL(backgroundImage)
                  : undefined
              }
              profileImage={
                profileImage ? URL.createObjectURL(profileImage) : undefined
              }
              creatorName={creatorName}
              description={description}
              instagramLink={instagramLink}
              twitterLink={twitterLink}
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
              textColor={textColor}
            />
          </div>

          <div className="fixed bottom-4 right-4 flex gap-4">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default CreateLandingPage;
