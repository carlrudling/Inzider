'use client';
import React, { useState, useRef, useEffect } from 'react';
import Nav from './Nav';
import AboutTripPage from './AboutTripPage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatePicker } from 'rsuite';
import TripDayPage from './TripDayPage';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoPlusCircle } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';
import { useCreatorData } from '../provider/CreatorProvider';
import SlideItem from './SlideItem';
import { useRouter } from 'next/navigation';

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

interface TripFormProps {
  initialData?: {
    id?: string;
    title?: string;
    price?: string;
    currency?: string;
    description?: string;
    slides?: Array<File | { src: string; type: 'image' | 'video' }>;
    specifics?: { label: string; value: string }[];
    days?: {
      date: Date;
      spots: {
        title: string;
        location: string;
        description: string;
        specifics: { label: string; value: string }[];
        slides: Array<File | { src: string; type: 'image' | 'video' }>;
      }[];
    }[];
    status?: 'edit' | 'launch';
    startDate?: Date;
    endDate?: Date;
  };
  isEditing: boolean;
  onSave: (data: any, status: 'edit' | 'launch') => Promise<void>;
}

const TripForm: React.FC<TripFormProps> = ({
  initialData,
  isEditing,
  onSave,
}) => {
  const { creatorData } = useCreatorData();
  const router = useRouter();

  // Base states (similar to GoToForm)
  const [showAboutPageFields, setShowAboutPageFields] = useState(false);
  const [showTripSpotsFields, setShowTripSpotsFields] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [creatorWords, setCreatorWords] = useState('');
  const [status, setStatus] = useState<'edit' | 'launch' | ''>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [specifics, setSpecifics] = useState([{ label: '', value: '' }]);
  const [slides, setSlides] = useState<
    (File | { src: string; type: 'image' | 'video' })[]
  >([]);

  // Trip-specific states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [days, setDays] = useState<
    {
      date: Date;
      spots: {
        title: string;
        location: string;
        description: string;
        specifics: { label: string; value: string }[];
        slides: (File | { src: string; type: 'image' | 'video' })[];
      }[];
    }[]
  >([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeSpotIndex, setActiveSpotIndex] = useState(0);
  const currentDay = days[activeDayIndex] || { date: new Date(), spots: [] };

  useEffect(() => {
    if (initialData) {
      // Base data
      setTitle(initialData.title || '');
      setPrice(initialData.price || '');
      setCurrency(initialData.currency || 'USD');
      setCreatorWords(initialData.description || '');
      setSlides(
        initialData.slides?.map((slide, index) => ({
          ...slide,
          order: index,
        })) || []
      );
      setSpecifics(initialData.specifics || [{ label: '', value: '' }]);

      // Trip-specific data
      if (initialData.startDate) setStartDate(new Date(initialData.startDate));
      if (initialData.endDate) setEndDate(new Date(initialData.endDate));

      setDays(
        initialData.days?.map((day) => ({
          date: new Date(day.date),
          spots: day.spots.map((spot) => ({
            ...spot,
            slides: spot.slides?.map((slide, index) => ({
              ...slide,
              order: index,
            })),
          })),
        })) || []
      );

      if (initialData.status) {
        setStatus(initialData.status);
      }
    }
  }, [initialData]);

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

    // Ensure that a spot exists for the current day
    if (days.length > 0) {
      const updatedDays = [...days];

      // Ensure the day exists
      if (!updatedDays[activeDayIndex]) {
        updatedDays[activeDayIndex] = { date: new Date(), spots: [] };
      }

      if (updatedDays[activeDayIndex].spots.length === 0) {
        updatedDays[activeDayIndex].spots.push({
          title: '',
          location: '',
          description: '',
          specifics: [{ label: '', value: '' }],
          slides: [],
        });
        setDays(updatedDays);
      }
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regular expression to allow positive numbers with up to two decimal places
    const validPriceRegex = /^(?:\d+|\d+\.\d{0,2})?$/;
    if (value === '' || validPriceRegex.test(value)) {
      setPrice(value);
    }
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
    setDays((prevDays) => {
      const updatedDays = [...prevDays];

      // Safeguard: Ensure day exists
      const day = updatedDays[activeDayIndex] || {
        date: new Date(),
        spots: [],
      };

      // Safeguard: Ensure spot exists
      const updatedSpots = [...day.spots];
      const spot = updatedSpots[activeSpotIndex] || {
        title: '',
        location: '',
        description: '',
        specifics: [{ label: '', value: '' }],
        slides: [],
      };

      // Update the specific spot key
      updatedSpots[activeSpotIndex] = { ...spot, [key]: value };
      day.spots = updatedSpots;
      updatedDays[activeDayIndex] = day;

      return updatedDays;
    });
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
      const newDays = generateDaysArray(startDate, endDate);

      setDays((prevDays) => {
        return newDays.map((day) => {
          const existingDay = prevDays.find((d) => isSameDay(d.date, day.date));

          // Safely merge any existing spots or additional fields
          return existingDay ? { ...day, spots: existingDay.spots || [] } : day;
        });
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

  const initializeDaySpots = (dayIndex: number) => {
    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      if (!updatedDays[dayIndex].spots) {
        updatedDays[dayIndex] = { ...updatedDays[dayIndex], spots: [] };
      }
      return updatedDays;
    });
  };

  const goToPreviousDay = () => {
    if (activeDayIndex > 0) {
      setActiveDayIndex(activeDayIndex - 1);
      setActiveSpotIndex(0); // Reset spot index when changing day
    }
  };

  const goToNextDay = () => {
    if (activeDayIndex < days.length - 1) {
      initializeDaySpots(activeDayIndex + 1);
      setActiveDayIndex(activeDayIndex + 1);
      setActiveSpotIndex(0);
    }
  };

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
        return prevSpecifics
          .map((field) =>
            field.label === durationLabel
              ? { label: durationLabel, value: durationValue }
              : field
          )
          .concat(
            prevSpecifics.some((field) => field.label === durationLabel)
              ? []
              : [{ label: durationLabel, value: durationValue }]
          );
      });
    }
  }, [startDate, endDate]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Upload failed');
      return null;
    }

    const { fileUrl } = await res.json();
    return fileUrl as string;
  };

  const uploadAllFiles = async (
    files: Array<File | { src: string; type: 'image' | 'video' }>
  ) => {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        if (file instanceof File) {
          // Handle new file upload
          return uploadFile(file);
        }
        // Return existing file data
        return file;
      })
    );
    return uploadedFiles;
  };

  // ADD THE HANDLE SAVE HERE BUT FOR TRIP

  const handleSave = async (status: 'edit' | 'launch') => {
    if (!creatorData || !creatorData._id) {
      alert('No creator ID found!');
      return;
    }
    if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) {
      alert('Invalid start or end date');
      return;
    }

    try {
      const uploadedSlides = await uploadAllFiles(slides);
      const updatedDays = await Promise.all(
        days.map(async (day) => {
          const updatedSpots = await Promise.all(
            day.spots.map(async (spot) => {
              const uploadedSpotSlides = await uploadAllFiles(spot.slides);
              return {
                ...spot,
                slides: uploadedSpotSlides,
              };
            })
          );
          return { ...day, spots: updatedSpots };
        })
      );

      const tripData = {
        creatorId: creatorData._id,
        title,
        description: creatorWords,
        price: parseFloat(price) || 0,
        currency,
        specifics,
        slides: uploadedSlides,
        days: updatedDays,
        status,
        startDate,
        endDate,
      };

      await onSave(tripData, status);
      // Update local status after successful save
      setStatus(status);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip');
    }
  };

  const handleSaveChanges = () => {
    handleSave('edit');
  };

  const handleLaunch = () => {
    handleSave('launch');
  };

  // Add delete handler
  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      const response = await fetch(`/api/trips/${initialData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      alert('Trip deleted successfully!');
      router.push('/dashboard'); // Redirect to dashboard after deletion
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Error deleting trip');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen bg-gray-100 flex">
        <div className="absolute top-0 left-0 w-full z-10">
          <Nav isWhiteText={false} />
        </div>

        <div className="absolute top-0 right-4 mt-28 flex bg-indigo-100 text-indigo-800 text-center text-xs font-medium px-2.5 py-0.5 rounded-full">
          <p>Status: </p> <span className="font-bold">{status || 'N/A'}</span>
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
                        type="number"
                        step="0.01"
                        className="block w-full border-gray-300 rounded-md shadow-sm"
                        placeholder="49.99"
                        value={price}
                        onChange={handlePriceChange}
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
                        key={file instanceof File ? file.name : file.src}
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
                        key={file instanceof File ? file.name : file.src}
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
                title={title}
                price={price}
                currency={currency}
                slides={slides.map((file) => ({
                  type:
                    file instanceof File
                      ? file.type.startsWith('image')
                        ? 'image'
                        : 'video'
                      : file.type,
                  src:
                    file instanceof File ? URL.createObjectURL(file) : file.src,
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
                      type:
                        file instanceof File
                          ? file.type.startsWith('image')
                            ? 'image'
                            : 'video'
                          : file.type,
                      src:
                        file instanceof File
                          ? URL.createObjectURL(file)
                          : file.src,
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
            {isEditing && (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            )}
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

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="mb-4">
                  Are you sure you want to delete this trip?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default TripForm;
