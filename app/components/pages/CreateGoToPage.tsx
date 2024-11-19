'use client';
import React, { useState, useRef } from 'react';
import Nav from '../Nav';
import AboutTripPage from './AboutTripPage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TripDayPage from './TripDayPage';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoPlusCircle } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';
import GoToPage from './GoToPage';

interface CreateGoToPageProps {
  onNavigate: (page: string) => void;
}

interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: { label: string; value: string }[];
  slides: File[];
}

interface SlideItemProps {
  file: File;
  index: number;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  handleRemoveMedia: (index: number) => void;
}

const ItemType = {
  SLIDE: 'slide',
};

const SlideItem: React.FC<SlideItemProps> = ({
  file,
  index,
  moveSlide,
  handleRemoveMedia,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: ItemType.SLIDE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.SLIDE,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveSlide(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="relative w-24 h-24">
      {file.type.startsWith('image') ? (
        <img
          src={URL.createObjectURL(file)}
          alt="Uploaded"
          className="rounded-md w-full h-full object-cover"
        />
      ) : (
        <video
          src={URL.createObjectURL(file)}
          controls
          className="rounded-md w-full h-full object-cover"
        />
      )}
      <button
        onClick={() => handleRemoveMedia(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        style={{ fontSize: '14px', lineHeight: '1' }}
      >
        &times;
      </button>
    </div>
  );
};

const CreateGoToPage: React.FC<CreateGoToPageProps> = ({ onNavigate }) => {
  const [showAboutPageFields, setShowAboutPageFields] = useState(false);
  const [showTripSpotsFields, setShowTripSpotsFields] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [creatorWords, setCreatorWords] = useState('');
  const [slides, setSlides] = useState<File[]>([]);
  const [specifics, setSpecifics] = useState([{ label: '', value: '' }]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [activeSpotIndex, setActiveSpotIndex] = useState<number>(0);

  const currentSpot = spots[activeSpotIndex]
    ? {
        ...spots[activeSpotIndex], // Spread existing spot properties if it exists
        specifics: spots[activeSpotIndex].specifics || [
          { label: '', value: '' },
        ],
      }
    : {
        // Default properties for a new spot
        title: '',
        location: '',
        description: '',
        specifics: [{ label: '', value: '' }],
        slides: [],
      };

  const showAboutPageFieldsOnly = () => {
    setShowAboutPageFields(true);
    setShowTripSpotsFields(false);
  };
  const showTripSpotsFieldsOnly = () => {
    setShowAboutPageFields(false);
    setShowTripSpotsFields(true);
  };
  const handleAddSpecificField = () =>
    setSpecifics([...specifics, { label: '', value: '' }]);

  const handleSpecificFieldChange = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const newSpecifics = [...specifics];
    newSpecifics[index][field] = value;
    setSpecifics(newSpecifics);
  };

  const handleRemoveSpecificField = (index: number) =>
    setSpecifics(specifics.filter((_, i) => i !== index));

  // Handler to add a new spot
  const addSpot = () => {
    const newSpot: Spot = {
      title: '',
      location: '',
      description: '',
      specifics: [{ label: '', value: '' }],
      slides: [],
    };
    const updatedSpots = [...spots, newSpot];
    setSpots(updatedSpots);
    setActiveSpotIndex(updatedSpots.length - 1);
  };

  // Update the current spot
  const updateCurrentSpot = (key: keyof Spot, value: any) => {
    const updatedSpots = [...spots];
    updatedSpots[activeSpotIndex] = {
      ...updatedSpots[activeSpotIndex],
      [key]: value,
    };
    setSpots(updatedSpots);
  };

  // Update specifics for the current spot
  const addSpotSpecificField = () => {
    const updatedSpots = [...spots];
    updatedSpots[activeSpotIndex].specifics.push({
      label: '',
      value: '',
    });
    setSpots(updatedSpots);
  };

  const updateSpotSpecificField = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const updatedSpots = [...spots];
    updatedSpots[activeSpotIndex].specifics[index][field] = value;
    setSpots(updatedSpots);
  };

  const removeSpotSpecificField = (index: number) => {
    const updatedSpots = [...spots];
    updatedSpots[activeSpotIndex].specifics = updatedSpots[
      activeSpotIndex
    ].specifics.filter((_, i) => i !== index);
    setSpots(updatedSpots);
  };

  const handleSpotMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedSpots = [...spots];
      updatedSpots[activeSpotIndex].slides = [
        ...updatedSpots[activeSpotIndex].slides,
        ...newFiles,
      ];
      setSpots(updatedSpots);
    }
  };

  const handleRemoveSpotMedia = (index: number) => {
    const updatedSpots = [...spots];
    updatedSpots[activeSpotIndex].slides = updatedSpots[
      activeSpotIndex
    ].slides.filter((_, i) => i !== index);
    setSpots(updatedSpots);
  };

  const moveSpotSlide = (fromIndex: number, toIndex: number) => {
    const updatedSpots = [...spots];
    const spotSlides = [...updatedSpots[activeSpotIndex].slides];
    const [movedSlide] = spotSlides.splice(fromIndex, 1);
    spotSlides.splice(toIndex, 0, movedSlide);
    updatedSpots[activeSpotIndex].slides = spotSlides;
    setSpots(updatedSpots);
  };

  // Remove the current spot
  const removeSpot = () => {
    if (spots.length > 0) {
      const updatedSpots = spots.filter((_, i) => i !== activeSpotIndex);
      setSpots(updatedSpots);
      setActiveSpotIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const goToPreviousSpot = () => {
    if (activeSpotIndex > 0) {
      setActiveSpotIndex(activeSpotIndex - 1);
    }
  };

  const goToNextSpot = () => {
    if (activeSpotIndex < spots.length - 1) {
      setActiveSpotIndex(activeSpotIndex + 1);
    }
  };

  const handleAboutPageMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSlides((prevSlides) => [...prevSlides, ...newFiles]);
    }
  };

  const handleAboutPageRemoveMedia = (index: number) =>
    setSlides((prevFiles) => prevFiles.filter((_, i) => i !== index));

  const moveAboutPageSlide = (fromIndex: number, toIndex: number) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, movedSlide);
    setSlides(updatedSlides);
  };

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    // Add more currencies as needed
  };

  const handleSaveChanges = () => {
    console.log('Changes saved!');
    // Add your save logic here
  };

  const handleLaunch = () => {
    console.log('Launching!');
    // Add your launch logic here
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen bg-gray-100 flex">
        <div className="absolute top-0 left-0 w-full z-10">
          <Nav onNavigate={onNavigate} isWhiteText={false} />
        </div>

        <aside className="w-1/4 h-screen sticky top-20 bg-gray-50 p-8 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 mt-20">GoTo Collection</h2>
          <nav>
            <ul className="space-y-2">
              <li
                className={`font-semibold cursor-pointer ${
                  showAboutPageFields ? 'text-gray-700' : 'text-gray-500'
                }`}
                onClick={showAboutPageFieldsOnly}
              >
                About Page
              </li>

              {showAboutPageFields && (
                <div className="mt-2 space-y-4 pl-4">
                  <label className="block">
                    <span className="text-gray-700">Name of collection</span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      placeholder="Ex: Drinks in San Sebastian"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      rows={3}
                      placeholder="A shorter description of what to expect in this GoTo Collection"
                      value={creatorWords}
                      onChange={(e) => setCreatorWords(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Price</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        className="block w-full border-gray-300 rounded-md shadow-sm"
                        placeholder="49.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />

                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        {/* Add more currencies as needed */}
                      </select>
                    </div>
                  </label>

                  {/* Specifics Section */}
                  <div>
                    <h3 className="text-gray-700 font-bold">Specifics</h3>

                    {specifics.map((field, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label"
                          value={field.label}
                          onChange={(e) =>
                            handleSpecificFieldChange(
                              index,
                              'label',
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) =>
                            handleSpecificFieldChange(
                              index,
                              'value',
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                        />
                        <button
                          onClick={() => handleRemoveSpecificField(index)}
                          className="text-red-500 font-bold text-sm"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddSpecificField}
                      className="text-blue-500 mt-2 text-sm"
                    >
                      Add another
                    </button>
                  </div>

                  {/* Media Upload Section */}
                  <div className="mt-6">
                    <label className="block text-gray-700">
                      Upload images and/or videos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleAboutPageMediaUpload}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md w-full mt-2"
                    />
                  </div>

                  <div className="flex flex-wrap mt-4 gap-4">
                    {slides.map((file, index) => (
                      <SlideItem
                        key={file.name}
                        file={file}
                        index={index}
                        moveSlide={moveAboutPageSlide}
                        handleRemoveMedia={handleAboutPageRemoveMedia}
                      />
                    ))}
                  </div>
                </div>
              )}

              <li
                className={'font-semibold cursor-pointer'}
                onClick={showTripSpotsFieldsOnly}
              >
                Spots
              </li>
              {showTripSpotsFields && (
                <div className="mt-2 space-y-4 pl-4">
                  <label className="block">
                    <span className="text-gray-700">Name of the spot</span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      placeholder="Ex: Djournal Coffee Bar"
                      value={currentSpot.title}
                      onChange={(e) =>
                        updateCurrentSpot('title', e.target.value)
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Location</span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      placeholder="Address to the place"
                      value={currentSpot.location || ''}
                      onChange={(e) =>
                        updateCurrentSpot('location', e.target.value)
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">About the place</span>
                    <textarea
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      rows={3}
                      placeholder="A shorter description of the spot and your experience there"
                      value={currentSpot.description || ''}
                      onChange={(e) =>
                        updateCurrentSpot('description', e.target.value)
                      }
                    />
                  </label>

                  {/* Specifics Section for Each Spot */}
                  <div>
                    <h3 className="text-gray-700 font-bold">Specifics</h3>
                    {currentSpot.specifics?.map((field, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label"
                          value={field.label}
                          onChange={(e) =>
                            updateSpotSpecificField(
                              index,
                              'label',
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) =>
                            updateSpotSpecificField(
                              index,
                              'value',
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                        />
                        <button
                          onClick={() => removeSpotSpecificField(index)}
                          className="text-red-500 font-bold text-sm"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addSpotSpecificField}
                      className="text-blue-500 mt-2 text-sm"
                    >
                      Add another
                    </button>
                  </div>

                  {/* Media Upload Section for Each Spot */}
                  <div className="mt-6">
                    <label className="block text-gray-700">
                      Upload images and/or videos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleSpotMediaUpload}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md w-full mt-2"
                    />
                  </div>

                  {/* Render Spot Slides Using SlideItem with Drag-and-Drop */}
                  <div className="flex flex-wrap mt-4 gap-4">
                    {currentSpot.slides.map((file, index) => (
                      <SlideItem
                        key={file.name}
                        file={file}
                        index={index}
                        moveSlide={moveSpotSlide}
                        handleRemoveMedia={handleRemoveSpotMedia}
                      />
                    ))}
                  </div>

                  {/* Navigation and Other Controls */}
                  <div className="flex flex-col items-center gap-4">
                    {/* Spot Navigation */}
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={goToPreviousSpot}
                        className="text-gray-400"
                      >
                        <FaChevronLeft className="h-6 w-6" />
                      </button>

                      {/* Display Spot Number */}
                      <span className="italic text-base font-semibold">
                        Spot {activeSpotIndex + 1}/{spots.length}
                      </span>

                      <button onClick={goToNextSpot} className="text-gray-400">
                        <FaChevronRight className="h-6 w-6" />
                      </button>

                      {/* Remove and Add Spot Buttons */}
                      <button onClick={removeSpot} className="text-red-500">
                        <RxCrossCircled className="h-6 w-6" />
                      </button>
                      <button onClick={addSpot} className="text-green-500">
                        <GoPlusCircle className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <li className="text-gray-500 cursor-pointer hover:text-gray-800">
                Other
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-grow p-8 overflow-y-auto h-screen">
          <div className="mt-20">
            {showAboutPageFields && (
              <AboutTripPage
                onNavigate={onNavigate}
                title={title}
                price={price}
                currency={currency}
                slides={slides.map((file) => ({
                  type: file.type.startsWith('image') ? 'image' : 'video',
                  src: URL.createObjectURL(file),
                }))}
                specifics={specifics}
                creatorWords={creatorWords}
                reviewCount={36}
                averageRating={4.5}
                purchaseCount={278}
              />
            )}

            {showTripSpotsFields &&
              spots.map((spot, index) => (
                <React.Fragment key={index}>
                  <GoToPage
                    title={spot.title || 'No Title'}
                    subtitle={title}
                    slides={spot.slides.map((file) => ({
                      type: file.type.startsWith('image') ? 'image' : 'video',
                      src: URL.createObjectURL(file),
                    }))}
                    address={spot.location || ''}
                    creatorWords={spot.description || ''}
                    specifics={spot.specifics || []}
                    pageNumber={`${index + 1}`}
                    totalPages={`${spots.length}`}
                  />
                  {index < spots.length - 1 && (
                    <hr className="my-8 block mx-auto border-t w-[460px] border-gray-300" />
                  )}
                </React.Fragment>
              ))}
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default CreateGoToPage;
