import React from 'react';
import Carousel from '../Carousel';
import GoToHeader from '../GoToHeader';
import LocationBlock from '../LocationBlock';
import TextBlock from '../TextBlock';
import DetailsBlock from '../DetailsBlock';

interface Slide {
  type: 'image' | 'video';
  src: string;
}

interface Specific {
  label: string;
  value: string | number;
}

interface GoToPageProps {
  title: string;
  subtitle: string;
  slides: Slide[];
  address: string;
  creatorWords: string;
  specifics: Specific[];
  pageNumber: string;
  totalPages: string;
}

const GoToPage: React.FC<GoToPageProps> = ({
  title,
  subtitle,
  slides,
  address,
  creatorWords,
  specifics,
  pageNumber,
  totalPages,
}) => {
  return (
    <section className="relative flex flex-col items-center justify-start text-white bg-cover bg-center">
      <div className="w-full flex justify-center">
        <div className="eqtAab w-full max-w-[460px] mx-auto mb-6">
          {/* Render Spot Content */}
          <div className="flex flex-col w-full">
            {/* Spot Content */}
            <div className="flex flex-col items-center w-full gap-4">
              {/* Header */}
              <GoToHeader
                title={title}
                subtitle={subtitle}
                pageNumber={pageNumber}
                totalPages={totalPages}
              />

              {/* Carousel */}
              <div className="flex justify-center mt-2 w-full px-4">
                <Carousel slides={slides} />
              </div>

              {/* Location Block */}
              <div className="flex justify-center mt-2 w-full px-4 overflow-hidden">
                <LocationBlock address={address} />
              </div>

              {/* Creator's Words */}
              <div className="flex justify-center mt-2 w-full px-4 overflow-hidden">
                <TextBlock title="Creator's words:" text={creatorWords} />
              </div>

              {/* Specifics */}
              <div className="flex justify-center mt-2 w-full px-4 overflow-hidden">
                <DetailsBlock title="Specifics" details={specifics} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoToPage;
