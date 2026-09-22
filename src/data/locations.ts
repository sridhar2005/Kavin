import { GeoLocation } from '../types/weather';

export const GLOBAL_LOCATIONS: GeoLocation[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lon: 72.8777,
    elevation: 14,
    climateZone: 'Tropical Wet & Dry (Monsoon Regulated)',
    defaultRegime: 'Monsoon'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    state: 'Kanto',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    elevation: 40,
    climateZone: 'Humid Subtropical (Marine Influenced)',
    defaultRegime: 'Transitional'
  },
  {
    id: 'newyork',
    name: 'New York',
    state: 'NY',
    country: 'United States',
    lat: 40.7128,
    lon: -74.0060,
    elevation: 10,
    climateZone: 'Humid Continental / Coastal',
    defaultRegime: 'Normal'
  },
  {
    id: 'london',
    name: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    elevation: 25,
    climateZone: 'Temperate Maritime (Oceanic)',
    defaultRegime: 'Normal'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    state: 'Central',
    country: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    elevation: 15,
    climateZone: 'Equatorial Rainforest (High Convection)',
    defaultRegime: 'Convective'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    state: 'NSW',
    country: 'Australia',
    lat: -33.8688,
    lon: 151.2093,
    elevation: 19,
    climateZone: 'Humid Subtropical / Coastal Marine',
    defaultRegime: 'High-Wind / Gale'
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    state: 'Hesse',
    country: 'Germany',
    lat: 50.1109,
    lon: 8.6821,
    elevation: 112,
    climateZone: 'Temperate Continental',
    defaultRegime: 'Normal'
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    state: 'Nairobi County',
    country: 'Kenya',
    lat: -1.2921,
    lon: 36.8219,
    elevation: 1795,
    climateZone: 'Subtropical Highland (Bimodal Wet)',
    defaultRegime: 'Dry / Stable'
  }
];
