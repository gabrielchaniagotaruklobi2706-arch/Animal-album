export type Language = 'id' | 'en';

export type ZoneId = 'sabana' | 'rainforest' | 'arctic' | 'ocean' | 'aviary' | 'reptile';

export type AlbumCategory = 'all' | 'sabana' | 'rainforest' | 'arctic' | 'ocean' | 'aviary' | 'reptile' | 'favorites';

export type DietType = 'herbivore' | 'carnivore' | 'omnivore';

export type ConservationStatus = 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export type ViewMode = 'grid' | 'polaroid' | 'compact';

export interface CameraDetails {
  camera: string;
  lens: string;
  shutter: string;
  aperture: string;
  iso: string;
}

export interface Animal {
  id: string;
  name: {
    id: string;
    en: string;
  };
  scientificName: string;
  emoji: string;
  zoneId: ZoneId;
  diet: DietType;
  status: ConservationStatus;
  statusLabel: {
    id: string;
    en: string;
  };
  imageUrl: string;
  habitat: {
    id: string;
    en: string;
  };
  origin: {
    id: string;
    en: string;
  };
  lifespan: string;
  weight: string;
  speed: string;
  description: {
    id: string;
    en: string;
  };
  funFacts: {
    id: string[];
    en: string[];
  };
  feedingTime: string;
  favoriteFood: {
    id: string;
    en: string;
    icon: string;
  };
  soundType: 'lion' | 'elephant' | 'bird' | 'wolf' | 'dolphin' | 'frog' | 'monkey' | 'tiger' | 'eagle' | 'whale' | 'owl' | 'general';
  photographer?: string;
  photoLocation?: {
    id: string;
    en: string;
  };
  photoYear?: string;
  cameraDetails?: CameraDetails;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  isUserUploaded?: boolean;
}

export interface ZooZone {
  id: ZoneId;
  name: {
    id: string;
    en: string;
  };
  emoji: string;
  tagline: {
    id: string;
    en: string;
  };
  description: {
    id: string;
    en: string;
  };
  color: string;
  mapCoordinates: { x: number; y: number }; // percentage 0-100
  iconName: string;
  temperature: string;
  animalCount: number;
}

export interface ShowSchedule {
  id: string;
  time: string;
  title: {
    id: string;
    en: string;
  };
  zoneId: ZoneId;
  location: {
    id: string;
    en: string;
  };
  animalEmoji: string;
  description: {
    id: string;
    en: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: {
    id: string;
    en: string;
  };
  options: {
    id: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: {
    id: string;
    en: string;
  };
  animalEmoji: string;
}

export interface PassportPhoto {
  id: string;
  animalId: string;
  animalName: string;
  emoji: string;
  date: string;
  imageUrl: string;
  caption: string;
}
