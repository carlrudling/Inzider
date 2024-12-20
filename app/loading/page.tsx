import React, { Suspense } from 'react';

const Lottie = React.lazy(() => import('lottie-react'));
import loadingAnimation2 from '../../utils/animations/loadingAnimation2.json';

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Full viewport height to center vertically
      }}
    >
      <Suspense fallback={<div>Loading animation...</div>}>
        <Lottie
          loop={true}
          animationData={loadingAnimation2}
          style={{ width: 500, height: 500 }}
        />
      </Suspense>
    </div>
  );
};

export default LoadingPage;
