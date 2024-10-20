import React from 'react';
import Nav from '../Nav';

interface CreatorPageProps {
  onNavigate: (page: string) => void;
}

const CreatorPage: React.FC<CreatorPageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Navigation component */}
      <Nav onNavigate={onNavigate} isWhiteText={false} />
      CreatorPage
    </div>
  );
};

export default CreatorPage;
