export type Tab = 'search' | 'route' | 'collections' | 'profile';
export type Role = 'from' | 'to';

// Координаты в порядке Leaflet/MapLibre-данных: [широта, долгота].
export type Coords = [number, number];

export interface Place {
  id: number;
  title: string;
  address: string;
  cat: string;
  coords: Coords;
}

export interface InterestChip {
  id: string;
  label: string;
}

export interface Collection {
  id: number;
  cat: string;
  title: string;
  time: string;
  km: string;
  img: string;
}

export interface DiscoverCardData {
  id: number;
  tag: string;
  title: string;
  time: string;
  km: string;
  img: string;
}

export interface RouteData {
  time: string;
  distance: string;
  difficulty: string;
  difficultyLevel: number;
  line: Coords[];
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface SavedRoute {
  id: number;
  title: string;
  time: string;
  km: number;
  tag: string;
  fav: boolean;
}
