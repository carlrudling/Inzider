'use client';

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingAnimation2 from '../utils/animations/loadingAnimation2.json';

interface LoaderProps {
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerStyle = fullScreen
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      };

  if (!mounted) {
    return (
      <div style={containerStyle}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Suspense fallback={<div>Loading animation...</div>}>
        <Lottie
          loop={true}
          animationData={loadingAnimation2}
          style={{
            width: fullScreen ? 500 : 200,
            height: fullScreen ? 500 : 200,
          }}
        />
      </Suspense>
    </div>
  );
};

export default Loader;
