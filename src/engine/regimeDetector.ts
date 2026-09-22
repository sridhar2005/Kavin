import { WeatherRegime, GeoLocation } from '../types/weather';

export interface RegimeAttributes {
  rainfallMm: number;
  temperatureC: number;
  windSpeedKmh: number;
  pressureHpa?: number;
  humidityPercent?: number;
}

export function detectWeatherRegime(
  attrs: RegimeAttributes,
  location: GeoLocation,
  overrideRegime?: WeatherRegime
): { regime: WeatherRegime; description: string; confidence: number; primaryDrivers: string[] } {
  if (overrideRegime) {
    return getRegimeProfile(overrideRegime, location);
  }

  const { rainfallMm, temperatureC, windSpeedKmh } = attrs;
  const drivers: string[] = [];

  if (rainfallMm > 65) {
    drivers.push(`Extreme 24h precipitation rate (${rainfallMm.toFixed(1)} mm)`);
    drivers.push('Saturated column with deep convective clouds');
    return {
      regime: 'Heavy Rainfall',
      description: 'Severe localized convective storm or tropical depression producing hazardous rainfall rates.',
      confidence: 96,
      primaryDrivers: drivers
    };
  }

  if (location.climateZone.includes('Monsoon') && rainfallMm > 25) {
    drivers.push('Southwest/Northeast monsoon trough alignment');
    drivers.push(`Sustained moisture influx (${rainfallMm.toFixed(1)} mm/day)`);
    return {
      regime: 'Monsoon',
      description: 'Large-scale seasonal monsoon circulation with continuous precipitation and high relative humidity.',
      confidence: 94,
      primaryDrivers: drivers
    };
  }

  if (windSpeedKmh > 55) {
    drivers.push(`Gale-force sustained wind (${windSpeedKmh.toFixed(0)} km/h)`);
    drivers.push('Tight barometric pressure gradient');
    return {
      regime: 'High-Wind / Gale',
      description: 'Extratropical low or coastal marine gale creating high aerodynamic drag and destructive gusts.',
      confidence: 92,
      primaryDrivers: drivers
    };
  }

  if (temperatureC > 37) {
    drivers.push(`Thermal surface anomaly (>37°C)`);
    drivers.push('Subtropical high-pressure ridge causing subsidence heating');
    return {
      regime: 'Heat-Wave',
      description: 'Persistent atmospheric stagnation causing dangerous heat index and low diurnal cooling.',
      confidence: 95,
      primaryDrivers: drivers
    };
  }

  if (rainfallMm > 15 && temperatureC > 28) {
    drivers.push('High convective available potential energy (CAPE)');
    drivers.push('Thermal updraft triggers');
    return {
      regime: 'Convective',
      description: 'Thermodynamically unstable airmass with afternoon thunderstorm development potential.',
      confidence: 88,
      primaryDrivers: drivers
    };
  }

  if (rainfallMm < 0.5 && temperatureC < 33 && windSpeedKmh < 30) {
    drivers.push('Stable anticyclonic capping inversion');
    drivers.push('Minimal atmospheric moisture');
    return {
      regime: 'Dry / Stable',
      description: 'High-pressure anticyclone with clear skies, light winds, and predictable diurnal trends.',
      confidence: 91,
      primaryDrivers: drivers
    };
  }

  return {
    regime: 'Normal',
    description: 'Typical seasonal synoptic flow with moderate pressure gradients and standard predictability.',
    confidence: 89,
    primaryDrivers: ['Standard mid-latitude/tropical baseline', 'Well-balanced atmospheric state']
  };
}

export function getRegimeProfile(regime: WeatherRegime, location: GeoLocation) {
  switch (regime) {
    case 'Heavy Rainfall':
      return {
        regime,
        description: 'Atmospheric moisture convergence producing extreme precipitation (>50 mm) and localized flash flooding risks.',
        confidence: 95,
        primaryDrivers: ['Deep convective towers', 'High precipitable water (>60mm)', 'Strong low-level jet advection']
      };
    case 'Monsoon':
      return {
        regime,
        description: `Active seasonal monsoon trough active over ${location.name} region with high boundary-layer humidity.`,
        confidence: 94,
        primaryDrivers: ['Southwest monsoon moisture flux', 'Equatorial cross-flow', 'Sustained precipitation bands']
      };
    case 'Heat-Wave':
      return {
        regime,
        description: 'Persistent upper-level anticyclonic dome trapping heat with 4–8°C positive temperature anomaly.',
        confidence: 93,
        primaryDrivers: ['850 hPa thermal ridge', 'Subsidence adiabatic heating', 'Low cloud coverage']
      };
    case 'High-Wind / Gale':
      return {
        regime,
        description: 'Intense pressure gradient between adjacent air masses generating hazardous gale-force gusts.',
        confidence: 92,
        primaryDrivers: ['Isobaric packing', 'Marine cyclonic boundary', 'Jet stream coupling']
      };
    case 'Convective':
      return {
        regime,
        description: 'Elevated CAPE and steep lapse rates driving rapid afternoon storm cell generation.',
        confidence: 88,
        primaryDrivers: ['High CAPE (>2200 J/kg)', 'Low-level moisture convergence', 'Surface solar heating']
      };
    case 'Dry / Stable':
      return {
        regime,
        description: 'Stable anticyclone dominating the troposphere with subsidence and minimal cloudiness.',
        confidence: 90,
        primaryDrivers: ['Subtropical high pressure', 'Negative vorticity advection', 'Dry air column']
      };
    case 'Storm-Risk':
      return {
        regime,
        description: 'Mesoscale convective complex approaching with high lightning density and squall potential.',
        confidence: 91,
        primaryDrivers: ['Frontal boundary clash', 'Elevated wind shear', 'Severe instability']
      };
    case 'Transitional':
      return {
        regime,
        description: 'Frontal boundary passage transitioning between maritime and continental airmasses.',
        confidence: 85,
        primaryDrivers: ['Baroclinic zone migration', 'Wind direction shift', 'Rapid pressure trend']
      };
    case 'Normal':
    default:
      return {
        regime: 'Normal' as WeatherRegime,
        description: 'Equilibrium synoptic state with standard model predictability across all forecast windows.',
        confidence: 90,
        primaryDrivers: ['Standard zonal circulation', 'Moderate humidity and wind profile']
      };
  }
}
