export interface Specific {
  label: string;
  value: string;
}

export interface Slide {
  src: string;
  type: 'image' | 'video';
}

export interface Spot {
  title: string;
  location: string;
  description: string;
  specifics: Specific[];
  slides: (File | Slide)[];
}

export interface Day {
  date: Date;
  spots: Spot[];
}

export interface TripData {
  id: string;
  title?: string;
  price?: string;
  currency?: string;
  description?: string;
  slides?: (File | Slide)[];
  specifics?: Specific[];
  days?: Day[];
  startDate?: Date;
  endDate?: Date;
  status?: 'edit' | 'launch';
}
