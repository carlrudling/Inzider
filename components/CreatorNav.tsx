import React from 'react';
import { FaTwitter, FaInstagram } from 'react-icons/fa';

const CreatorNav = () => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg fixed top-0 left-1/2 transform -translate-x-1/2 z-10 max-w-[580px] w-full">
      {/* Profile Image */}
      <div>
        <img
          src="https://via.placeholder.com/150" // Replace with actual image URL
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* Name and Username */}
      <div className="flex flex-col ml-2">
        <p className="text-base font-bold text-black">Joseph Garcia</p>
        <p className="text-xs text-gray-500">@Josephgarcia</p>
      </div>

      {/* Spacer to push social icons to the right */}
      <div className="flex-grow"></div>

      {/* Social Icons */}
      <div className="flex space-x-4 text-gray-500">
        <FaInstagram className="w-6 h-6 cursor-pointer hover:text-black" />
        <FaTwitter className="w-6 h-6 cursor-pointer hover:text-black" />
      </div>
    </div>
  );
};

export default CreatorNav;
