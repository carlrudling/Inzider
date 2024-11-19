'use client';
import React, { useState, useRef, useEffect } from 'react';
import Nav from '../Nav';
import AboutTripPage from './AboutTripPage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatePicker } from 'rsuite';
import TripDayPage from './TripDayPage';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoPlusCircle } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';

interface CreateTripPageProps {
  onNavigate: (page: string) => void;
}

interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: { label: string; value: string }[];
  slides: File[];
}

interface Day {
  date: Date;
  spots: Spot[];
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

const CreateTripPage: React.FC<CreateTripPageProps> = ({ onNavigate }) => {
  const [showAboutPageFields, setShowAboutPageFields] = useState(false);
  const [showTripSpotsFields, setShowTripSpotsFields] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [creatorWords, setCreatorWords] = useState('');
  const [slides, setSlides] = useState<File[]>([]);
  const [specifics, setSpecifics] = useState([{ label: '', value: '' }]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [days, setDays] = useState<Day[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeSpotIndex, setActiveSpotIndex] = useState(0);
  const currentDay = days[activeDayIndex] || { date: new Date(), spots: [] };

  const currentDayWeekday = currentDay.date.toLocaleDateString(undefined, {
    weekday: 'long', // This will give the full weekday name (e.g., "Monday")
  });

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
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots.push({
      title: '',
      location: '',
      description: '',
      specifics: [{ label: '', value: '' }],
      slides: [],
    });
    setDays(updatedDays);
    setActiveSpotIndex(updatedDays[activeDayIndex].spots.length - 1);
  };

  // Get the current spot
  const currentSpot = currentDay.spots[activeSpotIndex] || {
    title: '',
    location: '',
    description: '',
    specifics: [{ label: '', value: '' }],
    slides: [],
  };

  const updateCurrentSpot = (key: keyof Spot, value: any) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex] = {
      ...updatedDays[activeDayIndex].spots[activeSpotIndex],
      [key]: value,
    };
    setDays(updatedDays);
  };
  // Update specifics for the current spot
  const addSpotSpecificField = () => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex].specifics.push({
      label: '',
      value: '',
    });
    setDays(updatedDays);
  };

  const updateSpotSpecificField = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex].specifics[index][field] =
      value;
    setDays(updatedDays);
  };

  const removeSpotSpecificField = (index: number) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex].specifics = updatedDays[
      activeDayIndex
    ].spots[activeSpotIndex].specifics.filter((_, i) => i !== index);
    setDays(updatedDays);
  };

  const removeSpotSlide = (index: number) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex].slides = updatedDays[
      activeDayIndex
    ].spots[activeSpotIndex].slides.filter((_, i) => i !== index);
    setDays(updatedDays);
  };

  // Remove the current spot
  const removeSpot = () => {
    const updatedDays = [...days];
    if (updatedDays[activeDayIndex].spots.length > 0) {
      updatedDays[activeDayIndex].spots.splice(activeSpotIndex, 1);
      setDays(updatedDays);
      setActiveSpotIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  // Handler to update the current spot details in the spots array

  const goToPreviousSpot = () => {
    if (activeSpotIndex > 0) {
      setActiveSpotIndex(activeSpotIndex - 1);
    }
  };

  const goToNextSpot = () => {
    if (activeSpotIndex < days[activeDayIndex]?.spots.length - 1) {
      setActiveSpotIndex(activeSpotIndex + 1);
    }
  };

  const areDatesSet = (): boolean => {
    return Boolean(startDate && endDate);
  };

  const handleStartDateChange = (
    value: Date | null,
    _event: React.SyntheticEvent
  ) => {
    setStartDate(value ?? undefined);
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

  const handleSpotMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedDays = [...days];
      updatedDays[activeDayIndex].spots[activeSpotIndex].slides = [
        ...updatedDays[activeDayIndex].spots[activeSpotIndex].slides,
        ...newFiles,
      ];
      setDays(updatedDays);
    }
  };

  const handleRemoveSpotMedia = (index: number) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].spots[activeSpotIndex].slides = updatedDays[
      activeDayIndex
    ].spots[activeSpotIndex].slides.filter((_, i) => i !== index);
    setDays(updatedDays);
  };

  const moveSpotSlide = (fromIndex: number, toIndex: number) => {
    const updatedDays = [...days];
    const spotSlides = [
      ...updatedDays[activeDayIndex].spots[activeSpotIndex].slides,
    ];
    const [movedSlide] = spotSlides.splice(fromIndex, 1);
    spotSlides.splice(toIndex, 0, movedSlide);
    updatedDays[activeDayIndex].spots[activeSpotIndex].slides = spotSlides;
    setDays(updatedDays);
  };

  // Media upload handlers for active spot

  // Wrapper function for endDate onChange
  const handleEndDateChange = (
    value: Date | null,
    _event: React.SyntheticEvent
  ) => {
    setEndDate(value ?? undefined);
  };

  const handleRemoveMedia = (index: number) =>
    setSlides((prevFiles) => prevFiles.filter((_, i) => i !== index));

  const moveSlide = (fromIndex: number, toIndex: number) => {
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

  // Update "Duration" in specifics when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const durationInDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      const formattedStartDate = startDate.toLocaleDateString();
      const formattedEndDate = endDate.toLocaleDateString();
      const durationLabel = `Duration`;
      const durationValue = `${formattedStartDate} - ${formattedEndDate} (${durationInDays} days)`;

      setSpecifics((prevSpecifics) => {
        const durationIndex = prevSpecifics.findIndex(
          (field) => field.label === durationLabel
        );
        if (durationIndex >= 0) {
          const updatedSpecifics = [...prevSpecifics];
          updatedSpecifics[durationIndex] = {
            label: durationLabel,
            value: durationValue,
          };
          return updatedSpecifics;
        }
        return [
          ...prevSpecifics,
          { label: durationLabel, value: durationValue },
        ];
      });
    }
  }, [startDate, endDate]);

  function generateDaysArray(start: Date, end: Date): Day[] {
    const daysArray: Day[] = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      daysArray.push({ date: new Date(currentDate), spots: [] });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return daysArray;
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function formatDate(date?: Date): string {
    if (!date) return 'No Date';
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  const goToPreviousDay = () => {
    if (activeDayIndex > 0) {
      setActiveDayIndex(activeDayIndex - 1);
      setActiveSpotIndex(0); // Reset spot index when changing day
    }
  };

  const goToNextDay = () => {
    if (activeDayIndex < days.length - 1) {
      setActiveDayIndex(activeDayIndex + 1);
      setActiveSpotIndex(0); // Reset spot index when changing day
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const newDays = generateDaysArray(startDate, endDate);
      setDays((prevDays) => {
        // Preserve existing spots for overlapping days
        return newDays.map((day) => {
          const existingDay = prevDays.find((d) => isSameDay(d.date, day.date));
          return existingDay || day;
        });
      });
      // Reset activeDayIndex if necessary
      setActiveDayIndex(0);
    }
  }, [startDate, endDate]);

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
          <h2 className="text-xl font-bold mb-4 mt-20">Trip Itinerary</h2>
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
                    <span className="text-gray-700">Name of trip</span>
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
                      placeholder="A shorter description of what to expect in this Trip Itinerary"
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
                    <p className="text-sm">Start Date:</p>
                    <DatePicker
                      value={startDate || null}
                      onChange={handleStartDateChange}
                      format="MM/dd/yyyy"
                    />
                    <p className="text-sm mt-2">End Date:</p>
                    <DatePicker
                      value={endDate || null}
                      onChange={handleEndDateChange}
                      format="MM/dd/yyyy"
                    />

                    {specifics.map((field, index) => (
                      <div key={index} className="flex gap-2 mt-2 items-center">
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

              {!areDatesSet && (
                <div className="text-red-500 mb-4">
                  <strong>
                    Please fill in the dates first before proceeding to Days or
                    Spots.
                  </strong>
                </div>
              )}

              {/* Days Item */}
              <li
                className={`font-semibold cursor-pointer ${
                  areDatesSet()
                    ? 'text-gray-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={areDatesSet() ? showTripSpotsFieldsOnly : undefined}
              >
                Days
              </li>
              <li
                className={`font-semibold cursor-pointer ${
                  areDatesSet()
                    ? 'text-gray-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={areDatesSet() ? showTripSpotsFieldsOnly : undefined}
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
                    {currentSpot.specifics.map((field, index) => (
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
                        Spot {activeSpotIndex + 1}/{currentDay.spots.length}
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

                    {/* Day Navigation */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={goToPreviousDay}
                        className="text-gray-400"
                      >
                        <FaChevronLeft className="h-6 w-6" />
                      </button>

                      {/* Display Current Day */}
                      <span className="italic text-base font-semibold">
                        {days[activeDayIndex]?.date
                          ? formatDate(days[activeDayIndex].date)
                          : 'Select a Date'}
                      </span>

                      <button onClick={goToNextDay} className="text-gray-400">
                        <FaChevronRight className="h-6 w-6" />
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
              currentDay.spots.map((spot, index) => (
                <React.Fragment key={index}>
                  <TripDayPage
                    title={spot.title || 'No Title'}
                    subtitle={title}
                    slides={spot.slides.map((file) => ({
                      type: file.type.startsWith('image') ? 'image' : 'video',
                      src: URL.createObjectURL(file),
                    }))}
                    address={spot.location || ''}
                    creatorWords={spot.description || ''}
                    specifics={spot.specifics || []}
                    day={currentDayWeekday}
                  />
                  {index < currentDay.spots.length - 1 && (
                    <hr className="my-8 block mx-auto border-t w-[460px] border-gray-300" />
                  )}
                </React.Fragment>
              ))}
          </div>
          <div className="fixed bottom-4 right-4 flex gap-4">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={handleLaunch}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition duration-200"
            >
              Launch
            </button>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default CreateTripPage;
