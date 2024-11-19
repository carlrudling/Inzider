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
    <div
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full cursor-pointer"
      onClick={openMaps}
    >
      <h3 className="font-semibold font-poppins text-sm text-text-color1 mb-2">
        Location:
      </h3>

      <div className="ml-6 flex items-start space-x-2">
        <FaMapMarkerAlt className="text-text-color2 self-start mt-1" />
        <p className="text-black text-sm font-inter break-words leading-relaxed">
          {address}
        </p>
      </div>
    </div>
  );
};

export default LocationBlock;
