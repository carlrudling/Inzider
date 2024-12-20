import { useState } from 'react';
import { FaPlay } from 'react-icons/fa'; // Import the play icon

interface Slide {
  type: 'image' | 'video';
  src: string;
}

const Carousel = ({ slides }: { slides: Slide[] }) => {
  const [curr, setCurr] = useState(0);
  const [startX, setStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Function to handle dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diffX = clientX - startX;

    if (diffX > 50) {
      // Dragging right, move to the previous slide
      setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    } else if (diffX < -50) {
      // Dragging left, move to the next slide
      setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
    }

    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
  };

  // Handle click to open full-screen mode
  const handleFullScreen = () => {
    setIsFullScreen(true);
  };

  // Handle closing the full-screen modal
  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      {/* Normal Carousel */}
      <div
        className="overflow-hidden relative rounded-lg shadow-lg max-w-full mx-auto"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleMouseMove}
      >
        <div
          className="flex transition-transform ease-out duration-500 gap-4"
          style={{
            transform: `translateX(calc(-${curr * 100}% - ${curr * 16}px))`, // Adjust for gap between images/videos (16px)
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-w-full h-72 sm:h-80 md:h-96 object-cover rounded-lg flex items-center justify-center"
              onClick={handleFullScreen}
            >
              {slide.type === 'image' ? (
                <img
                  src={slide.src}
                  alt=""
                  className="h-full w-full object-cover rounded-lg cursor-pointer"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={slide.src}
                    className="h-full w-full object-cover rounded-lg cursor-pointer"
                    muted
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlay className="text-white text-4xl opacity-80" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots for indicating current slide */}
        <div className="absolute bottom-4 right-0 left-0">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`
                  transition-all w-2 h-2 bg-white rounded-full
                  ${curr === i ? 'p-1 bg-opacity-100' : 'bg-opacity-50'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Modal with swipe support */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center h-screen"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleMouseMove}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen">
            {slides[curr].type === 'image' ? (
              <img
                src={slides[curr].src}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={slides[curr].src}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            )}

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={handleCloseFullScreen}
            >
              &times;
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 text-white text-4xl"
            onClick={() =>
              setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
            }
          >
            &#10094;
          </button>
          <button
            className="absolute right-4 text-white text-4xl"
            onClick={() =>
              setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))
            }
          >
            &#10095;
          </button>
        </div>
      )}
    </>
  );
};

export default Carousel;
