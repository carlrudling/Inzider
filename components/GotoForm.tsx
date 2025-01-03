'use client';
import React, { useState, useRef, useEffect } from 'react';
import Nav from './Nav';
import AboutTripPage from './AboutTripPage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoPlusCircle } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';
import GoToPage from './GoToPage';
import SlideItem from './SlideItem';
import { useCreatorData } from '@/provider/CreatorProvider';
import { useRouter } from 'next/navigation';

interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: { label: string; value: string }[];
  slides: File[];
}

interface GoToFormProps {
  initialData?: {
    id?: string;
    title?: string;
    price?: string;
    currency?: string;
    description?: string;
    slides?: File[];
    specifics?: { label: string; value: string }[];
    spots?: Spot[];
    status?: 'edit' | 'launch'; // Add this line
  };
  isEditing: boolean;
  onSave: (data: any, status: 'edit' | 'launch') => Promise<void>;
}

const GoToForm: React.FC<GoToFormProps> = ({
  initialData,
  isEditing,
  onSave,
}) => {
  const { creatorData } = useCreatorData(); // Ensure this returns creatorData with at least creatorData._id
  const router = useRouter();

  const [showAboutPageFields, setShowAboutPageFields] = useState(false);
  const [showTripSpotsFields, setShowTripSpotsFields] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [creatorWords, setCreatorWords] = useState('');
  const [status, setStatus] = useState<'edit' | 'launch' | ''>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [specifics, setSpecifics] = useState([{ label: '', value: '' }]);
  const [slides, setSlides] = useState<
    (File | { src: string; type: 'image' | 'video' })[]
  >([]);
  const [spots, setSpots] = useState<
    {
      title: string;
      location: string;
      description: string;
      specifics: { label: string; value: string }[];
      slides: (File | { src: string; type: 'image' | 'video' })[];
    }[]
  >([]);
  const [activeSpotIndex, setActiveSpotIndex] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setPrice(initialData.price || '');
      setCurrency(initialData.currency || 'USD');
      setCreatorWords(initialData.description || '');
      setSlides(
        initialData.slides?.map((slide, index) => ({
          ...slide,
          order: index, // Ensure order property is added
        })) || []
      );
      setSpecifics(initialData.specifics || [{ label: '', value: '' }]);
      setSpots(
        initialData.spots?.map((spot) => ({
          ...spot,
          slides: spot.slides?.map((slide, index) => ({
            ...slide,
            order: index, // Ensure order property for spots
          })),
        })) || []
      );

      // Initialize status from the initial data
      if (initialData.status) {
        setStatus(initialData.status);
      }
    }
  }, [initialData]);

  const currentSpot = spots[activeSpotIndex]
    ? {
        ...spots[activeSpotIndex],
        specifics: spots[activeSpotIndex].specifics || [
          { label: '', value: '' },
        ],
        slides: spots[activeSpotIndex].slides || [],
      }
    : {
        title: '',
        location: '',
        description: '',
        specifics: [{ label: '', value: '' }],
        slides: [],
      };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validPriceRegex = /^(?:\d+|\d+\.\d{0,2})?$/;
    if (value === '' || validPriceRegex.test(value)) {
      setPrice(value);
    }
  };

  const showAboutPageFieldsOnly = () => {
    setShowAboutPageFields(true);
    setShowTripSpotsFields(false);
  };
  const showTripSpotsFieldsOnly = () => {
    setShowAboutPageFields(false);
    setShowTripSpotsFields(true);

    // Ensure that a spot exists
    if (spots.length === 0) {
      const newSpot: Spot = {
        title: '',
        location: '',
        description: '',
        specifics: [{ label: '', value: '' }],
        slides: [],
      };
      setSpots([newSpot]);
      setActiveSpotIndex(0);
    }
  };

  const handleRemoveSlide = async (index: number) => {
    const slideToRemove = slides[index];

    // If the slide has a URL, delete it from Cloudflare
    if (slideToRemove && 'src' in slideToRemove) {
      const response = await fetch(`/api/uploads/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: slideToRemove.src }),
      });

      if (!response.ok) {
        console.error('Failed to delete image from Cloudflare');
        return;
      }
    }

    // Remove slide from local state
    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);

    // Save updated data
    await handleSave('edit');
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

  const updateCurrentSpot = (key: keyof Spot, value: any) => {
    const updatedSpots = [...spots];

    if (!updatedSpots[activeSpotIndex]) {
      updatedSpots[activeSpotIndex] = {
        title: '',
        location: '',
        description: '',
        specifics: [{ label: '', value: '' }],
        slides: [],
      };
    }

    updatedSpots[activeSpotIndex] = {
      ...updatedSpots[activeSpotIndex],
      [key]: value,
    };
    setSpots(updatedSpots);
  };

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

    // Move the slide in the spot's slides array
    const [movedSlide] = spotSlides.splice(fromIndex, 1);
    spotSlides.splice(toIndex, 0, movedSlide);

    // Update order for all slides
    spotSlides.forEach((slide, index) => {
      if ('order' in slide) {
        slide.order = index;
      }
    });

    // Save back to the spots array
    updatedSpots[activeSpotIndex].slides = spotSlides;
    setSpots(updatedSpots);

    // Debugging
    console.log(
      'Spot slides after reorder:',
      updatedSpots[activeSpotIndex].slides
    );
  };

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

  const uploadFile = async (
    file: File,
    retryCount = 0
  ): Promise<string | null> => {
    console.log(
      'Starting file upload for:',
      file.name,
      `(${(file.size / (1024 * 1024)).toFixed(2)}MB)`
    );
    const maxRetries = 2;
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to /api/uploads...');
      const controller = new AbortController();
      // Increase timeout for larger files: 30 seconds base + 1 second per MB
      const timeout = 30000 + (file.size / (1024 * 1024)) * 1000;
      console.log(
        `Upload timeout set to ${(timeout / 1000).toFixed(1)} seconds`
      );
      const timeoutId = setTimeout(() => {
        console.log('Upload timed out, aborting...');
        controller.abort();
      }, timeout);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Upload response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload failed:', errorText);

        if (retryCount < maxRetries) {
          // Add exponential backoff between retries
          const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`Waiting ${backoffTime / 1000} seconds before retry...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));

          console.log(
            `Retrying upload (attempt ${retryCount + 1} of ${maxRetries})...`
          );
          return uploadFile(file, retryCount + 1);
        }
        return null;
      }

      const data = await res.json();
      console.log('Upload response data:', data);
      return data.fileUrl as string;
    } catch (error: any) {
      console.error('Error during file upload:', error);

      // Retry on network errors or timeouts
      if (
        retryCount < maxRetries &&
        (error instanceof TypeError || error.name === 'AbortError')
      ) {
        // Add exponential backoff between retries
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Waiting ${backoffTime / 1000} seconds before retry...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));

        console.log(
          `Retrying upload (attempt ${retryCount + 1} of ${maxRetries})...`
        );
        return uploadFile(file, retryCount + 1);
      }
      return null;
    }
  };

  const handleAboutPageMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) {
      console.log('No files selected');
      return;
    }

    try {
      const newFiles = Array.from(event.target.files);
      console.log(
        'Files selected:',
        newFiles.map((f) => f.name)
      );

      // Validate files before upload
      const validFiles = newFiles.filter((file) => {
        const isValidType =
          file.type.startsWith('image/') || file.type.startsWith('video/');
        const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit

        if (!isValidType) {
          console.error('Invalid file type:', file.name);
        }
        if (!isValidSize) {
          console.error('File too large:', file.name);
        }

        return isValidType && isValidSize;
      });

      if (validFiles.length !== newFiles.length) {
        alert(
          'Some files were skipped due to invalid type or size (max 100MB)'
        );
      }

      // Upload files with progress tracking
      for (const file of validFiles) {
        console.log('Attempting to upload file:', file.name);

        try {
          const fileUrl = await uploadFile(file);
          if (fileUrl) {
            console.log('File uploaded successfully:', fileUrl);
            setSlides((prevSlides) => [
              ...prevSlides,
              {
                type: file.type.startsWith('image') ? 'image' : 'video',
                src: fileUrl,
              },
            ]);
          } else {
            console.error('Failed to upload file:', file.name);
            alert(`Failed to upload ${file.name}. Please try again.`);
          }
        } catch (uploadError) {
          console.error('Error uploading file:', file.name, uploadError);
          alert(`Error uploading ${file.name}. Please try again.`);
        }
      }
    } catch (error) {
      console.error('Error in handleAboutPageMediaUpload:', error);
      alert('An error occurred while processing the files. Please try again.');
    }
  };

  const handleAboutPageRemoveMedia = (index: number) =>
    setSlides((prevFiles) => prevFiles.filter((_, i) => i !== index));

  const moveAboutPageSlide = (fromIndex: number, toIndex: number) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, movedSlide);

    // Reassign the correct order to all slides
    updatedSlides.forEach((slide, index) => {
      if ('order' in slide) {
        slide.order = index;
      }
    });

    setSlides(updatedSlides);

    console.log('Slides state after reordering:', updatedSlides);
  };

  const uploadAllFiles = async (
    files: (File | { src: string; type: 'image' | 'video' })[]
  ) => {
    const result: { type: 'image' | 'video'; src: string }[] = [];
    for (const file of files) {
      if (file instanceof File) {
        const url = await uploadFile(file);
        if (url) {
          result.push({
            type: file.type.startsWith('image') ? 'image' : 'video',
            src: url,
          });
        }
      } else {
        // Ensure `file` is explicitly typed
        result.push(file as { src: string; type: 'image' | 'video' });
      }
    }
    return result;
  };

  const handleSave = async (status: 'edit' | 'launch') => {
    if (!creatorData || !creatorData._id) {
      alert('No creator ID found!');
      return;
    }

    const validateSlide = (slide: any) =>
      slide instanceof File || (slide.src && slide.type);
    if (!slides.every(validateSlide)) {
      console.error('Invalid slide format:', slides);
      alert('Some slides are invalid. Please check and try again.');
      return;
    }

    const originalSlideKeys =
      initialData?.slides
        ?.map((slide) => ('src' in slide ? slide.src : null))
        .filter((key): key is string => key !== null) || [];

    const currentSlideKeys = slides
      .map((slide) =>
        slide instanceof File ? null : 'src' in slide ? slide.src : null
      )
      .filter((key): key is string => key !== null);

    const removedSlides = originalSlideKeys.filter(
      (key) => key && !currentSlideKeys.includes(key)
    );

    for (const key of removedSlides) {
      if (key) {
        try {
          await fetch('/api/uploads/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
          });
        } catch (error) {
          console.error(`Failed to delete slide from R2: ${key}`, error);
        }
      }
    }

    const processSlides = async (slides: any[]) => {
      return Promise.all(
        slides.map(async (slide, index) => {
          if (slide instanceof File) {
            const uploadedUrl = await uploadFile(slide).catch((err) => {
              console.error('File upload failed', err);
              return null;
            });
            if (!uploadedUrl) return null;
            return {
              src: uploadedUrl,
              type: slide.type.startsWith('image') ? 'image' : 'video',
              order: index,
            };
          } else if (slide.src && slide.type) {
            return { ...slide, order: index };
          }
          throw new Error('Invalid slide format');
        })
      ).then((results) => results.filter(Boolean));
    };

    const processedSlides = await Promise.all(
      slides.map(async (slide, index) => {
        if (slide instanceof File) {
          const uploadedUrl = await uploadFile(slide);
          return {
            src: uploadedUrl,
            type: slide.type.startsWith('image') ? 'image' : 'video',
            order: index,
          };
        } else if (slide.src && slide.type) {
          return { ...slide, order: index };
        } else {
          throw new Error('Invalid slide format');
        }
      })
    );

    const hasUniqueOrder = processedSlides.every(
      (slide, index) => slide.order === index
    );

    if (!hasUniqueOrder) {
      console.error('Slides order mismatch:', processedSlides);
      alert('Invalid slide order detected. Please retry.');
      return;
    }

    const updatedSpots = await Promise.all(
      spots.map(async (spot) => ({
        ...spot,
        slides: await processSlides(spot.slides),
      }))
    );

    const gotoData = {
      creatorId: creatorData._id,
      title,
      description: creatorWords,
      price: parseFloat(price) || 0,
      currency,
      specifics,
      slides: processedSlides,
      spots: updatedSpots,
      status,
    };
    console.log('Specifics during save:', specifics);
    console.log('Processed slides before save:', processedSlides);
    console.log('Final GoTo Data:', gotoData);

    try {
      await onSave(gotoData, status);

      // Update the status label dynamically
      setStatus(status);
      console.log(`Saved successfully with status: ${status}`);
    } catch (error) {
      console.error('Error during save:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleSaveChanges = () => {
    handleSave('edit');
  };

  const handleLaunch = () => {
    handleSave('launch');
  };
  const handleDeleteGoTo = async () => {
    if (!initialData?.id) {
      console.error('No GoTo ID available');
      setShowDeleteConfirmation(false);
      return;
    }

    try {
      // Delete all media files first
      const allSlides = [...slides, ...spots.flatMap((spot) => spot.slides)];

      for (const slide of allSlides) {
        if ('src' in slide && slide.src) {
          try {
            // Extract the key from the URL path
            const key = slide.src.split('/').pop();
            if (!key) continue;

            await fetch('/api/uploads/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key }),
            });
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
      }

      // Then delete the GoTo itself
      const response = await fetch(`/api/gotos/${initialData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete GoTo: ${error}`);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting GoTo:', error);
      setShowDeleteConfirmation(false);
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
                      </select>
                    </div>
                  </label>

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

                  <div className="mt-6">
                    <label className="block text-gray-700">
                      Upload images and/or videos
                    </label>
                    <div className="mt-2">
                      <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors">
                        <span>Choose files</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleAboutPageMediaUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-4 gap-4">
                    {slides.map((file, index) => (
                      <SlideItem
                        key={
                          file instanceof File
                            ? `${file.name}-${index}`
                            : file.src
                        }
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

                  <div className="flex flex-wrap mt-4 gap-4">
                    {currentSpot.slides.map((file, index) => (
                      <SlideItem
                        key={
                          file instanceof File
                            ? `${file.name}-${index}`
                            : file.src
                        }
                        file={file}
                        index={index}
                        moveSlide={moveSpotSlide}
                        handleRemoveMedia={handleRemoveSpotMedia}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={goToPreviousSpot}
                        className="text-gray-400"
                      >
                        <FaChevronLeft className="h-6 w-6" />
                      </button>

                      <span className="italic text-base font-semibold">
                        Spot {activeSpotIndex + 1}/{spots.length}
                      </span>

                      <button onClick={goToNextSpot} className="text-gray-400">
                        <FaChevronRight className="h-6 w-6" />
                      </button>

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
                title={title}
                price={price}
                currency={currency}
                slides={slides.map((fileOrObject) => {
                  if (fileOrObject instanceof File) {
                    return {
                      type: fileOrObject.type.startsWith('image')
                        ? 'image'
                        : 'video',
                      src: URL.createObjectURL(fileOrObject),
                    };
                  }
                  return fileOrObject; // Assume it's already in the correct format
                })}
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
                    slides={spot.slides.map(
                      (file) =>
                        file instanceof File
                          ? {
                              type: file.type.startsWith('image')
                                ? 'image'
                                : 'video',
                              src: URL.createObjectURL(file),
                            }
                          : file // Use `file` as-is for existing objects
                    )}
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

          <div className="fixed bottom-4 right-4 flex gap-4">
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>

            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
            >
              Save Changes (Edit)
            </button>
            <button
              onClick={handleLaunch}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition duration-200"
            >
              Launch
            </button>
          </div>
        </main>
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p>
                Are you sure you want to delete this GoTo? This action cannot be
                undone.
              </p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGoTo}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default GoToForm;
