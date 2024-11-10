import React, { useState, useRef, useEffect } from 'react';
import Nav from '../Nav';
import AboutTripPage from './AboutTripPage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatePicker } from 'rsuite';

interface CreateTripPageProps {
  onNavigate: (page: string) => void;
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
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [creatorWords, setCreatorWords] = useState('');
  const [slides, setSlides] = useState<File[]>([]);
  const [specifics, setSpecifics] = useState([{ label: '', value: '' }]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const toggleAboutPageFields = () => setShowAboutPageFields((prev) => !prev);

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

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSlides((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleStartDateChange = (
    value: Date | null,
    _event: React.SyntheticEvent
  ) => {
    setStartDate(value ?? undefined);
  };

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
                onClick={toggleAboutPageFields}
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
                      placeholder="A shorter description of the spot and your experience there"
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
                      onChange={handleMediaUpload}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md w-full mt-2"
                    />
                  </div>

                  <div className="flex flex-wrap mt-4 gap-4">
                    {slides.map((file, index) => (
                      <SlideItem
                        key={file.name}
                        file={file}
                        index={index}
                        moveSlide={moveSlide}
                        handleRemoveMedia={handleRemoveMedia}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Days Item */}
              <li className="text-gray-500 cursor-pointer hover:text-gray-800">
                Days
              </li>
              <li className="text-gray-500 cursor-pointer hover:text-gray-800">
                Spots
              </li>
              <li className="text-gray-500 cursor-pointer hover:text-gray-800">
                Other
              </li>
              <li className="text-gray-500 cursor-pointer hover:text-gray-800">
                Buyers
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-grow p-8 overflow-y-auto h-screen">
          <div className="mt-20">
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
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default CreateTripPage;
