import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface LocationBlockProps {
  address: string;
}

const LocationBlock: React.FC<LocationBlockProps> = ({ address }) => {
  const openMaps = () => {
    const encodedAddress = encodeURIComponent(address);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const mapUrl = isIOS
      ? `http://maps.apple.com/?q=${encodedAddress}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    window.open(mapUrl, '_blank');
  };

  return (
    <div className="flex justify-center mt-2 w-full px-4">
      <div
        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full cursor-pointer"
        onClick={openMaps}
      >
        <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
          Location:
        </h3>

        <div className="ml-6 flex flex-row items-center space-x-2">
          <FaMapMarkerAlt className="text-text-color2" />
          <p className="text-black text-xs font-inter">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationBlock;
