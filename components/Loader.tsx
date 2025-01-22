'use client';

import React, { Suspense } from 'react';

const Lottie = React.lazy(() => import('lottie-react'));
import loadingAnimation2 from '../utils/animations/loadingAnimation2.json';

interface LoaderProps {
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true }) => {
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
