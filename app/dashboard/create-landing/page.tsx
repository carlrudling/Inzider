'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Nav from '../../../components/Nav';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CreatorLandingPage from '@/components/CreatorLandingPage';
import { useCreatorData } from '@/provider/CreatorProvider';
import { useRouter } from 'next/navigation';

const CreateLandingPage = () => {
  const { creatorData } = useCreatorData();
  const router = useRouter();

  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [creatorName, setCreatorName] = useState('');
  const [description, setDescription] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [xLink, setXLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [buttonColor, setButtonColor] = useState('#726238');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [existingBackgroundUrl, setExistingBackgroundUrl] =
    useState<string>('');
  const [existingProfileUrl, setExistingProfileUrl] = useState<string>('');

  // Fetch creator data
  useEffect(() => {
    if (creatorData) {
      setCreatorName(creatorData.name || '');
      setDescription(creatorData.description || '');
      setInstagramLink(creatorData.instagram || '');
      setXLink(creatorData.xLink || '');
      setTiktokLink(creatorData.tiktok || '');
      setYoutubeLink(creatorData.youtube || '');
      setButtonColor(creatorData.buttonColor || '#726238');
      setButtonTextColor(creatorData.buttonTextColor || '#FFFFFF');
      setTextColor(creatorData.textColor || '#FFFFFF');
      setExistingBackgroundUrl(creatorData.backgroundImage || '');
      setExistingProfileUrl(creatorData.profileImage || '');
    }
  }, [creatorData]);

  // Image URL handling
  const backgroundImageURL = useMemo(() => {
    return backgroundImage
      ? URL.createObjectURL(backgroundImage)
      : existingBackgroundUrl;
  }, [backgroundImage, existingBackgroundUrl]);

  const profileImageURL = useMemo(() => {
    return profileImage
      ? URL.createObjectURL(profileImage)
      : existingProfileUrl;
  }, [profileImage, existingProfileUrl]);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      if (backgroundImage) URL.revokeObjectURL(backgroundImageURL);
      if (profileImage) URL.revokeObjectURL(profileImageURL);
    };
  }, [backgroundImage, profileImage, backgroundImageURL, profileImageURL]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const { fileUrl } = await res.json();
    return fileUrl;
  };

  const handleSaveChanges = async () => {
    try {
      if (!creatorData?._id) {
        alert('No creator ID found');
        return;
      }

      let backgroundImageUrl = existingBackgroundUrl;
      let profileImageUrl = existingProfileUrl;

      if (backgroundImage) {
        backgroundImageUrl = await uploadFile(backgroundImage);
      }
      if (profileImage) {
        profileImageUrl = await uploadFile(profileImage);
      }

      const response = await fetch(`/api/creators/${creatorData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: creatorName,
          description,
          instagramLink,
          xLink,
          tiktokLink,
          youtubeLink,
          buttonColor,
          buttonTextColor,
          textColor,
          backgroundImage: backgroundImageUrl,
          profileImage: profileImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update creator');
      }

      alert('Changes saved successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    }
  };

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen bg-gray-100 flex">
        <div className="absolute top-0 left-0 w-full z-10">
          <Nav isWhiteText={false} />
        </div>

        <aside className="w-1/4 h-screen sticky top-0 bg-gray-50 p-8 border-r border-gray-200 overflow-y-auto">
          <div className="pt-20">
            <h2 className="text-xl font-bold mb-4">Edit Landing Page</h2>
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
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Instagram</span>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="https://instagram.com/yourprofile"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">X (Twitter)</span>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="https://x.com/yourprofile"
                    value={xLink}
                    onChange={(e) => setXLink(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">TikTok</span>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="https://tiktok.com/@yourprofile"
                    value={tiktokLink}
                    onChange={(e) => setTiktokLink(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">YouTube</span>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="https://youtube.com/@yourchannel"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                  />
                </label>
              </div>

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

              <label className="block">
                <span className="text-gray-700">Text Color</span>
                <input
                  type="color"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </label>

              <p className="text-sm text-gray-600 italic mt-4">
                Note: The Go-tos and Trips buttons will only be visible on your
                public page when you have launched packages.
              </p>

              <button
                onClick={handleSaveChanges}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 mt-20">
          <div className="w-full max-w-md mx-auto">
            <CreatorLandingPage
              backgroundImage={backgroundImageURL}
              profileImage={profileImageURL}
              creatorName={creatorName}
              description={description}
              instagramLink={instagramLink}
              twitterLink={xLink}
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
              textColor={textColor}
              username={creatorData?.username}
              hasLaunchedGotos={true}
              hasLaunchedTrips={true}
            />
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default CreateLandingPage;
