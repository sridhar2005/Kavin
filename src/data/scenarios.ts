import { ScenarioPreset } from '../types/weather';

export const DEMO_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'normal',
    name: 'Standard Baseline (Normal Synoptic)',
    badge: 'Baseline',
    description: 'High model agreement across all dynamical cores under stable pressure systems.',
    regime: 'Normal',
    locationId: 'london',
    leadTime: 24,
    whyText: 'Stable barometric distribution with low convective instability. High skill across AI and high-resolution NWP models.'
  },
  {
    id: 'heavy_rain',
    name: 'Active Monsoon & Extreme Precipitation',
    badge: 'Heavy Rain Risk',
    description: 'Intense moisture advection with elevated precipitable water (PWAT > 65 mm).',
    regime: 'Heavy Rainfall',
    locationId: 'mumbai',
    leadTime: 12,
    whyText: 'NWP Model A (EC-IFS) receives an elevated adaptive weight (38%) due to superior boundary layer moisture physics during monsoon regimes.'
  },
  {
    id: 'heat_wave',
    name: 'Subtropical Heat-Dome & Thermal Inversion',
    badge: 'Heat-Wave Alert',
    description: 'Persistent high-pressure ridge with +6.5°C 850 hPa temperature anomaly.',
    regime: 'Heat-Wave',
    locationId: 'tokyo',
    leadTime: 24,
    whyText: 'AtmosML AI surrogate accurately captures surface thermal re-radiation and boundary adiabatic heating with 42% weighting.'
  },
  {
    id: 'cyclone_wind',
    name: 'Maritime Cyclone & Gale-Force Gusts',
    badge: 'Gale Warning',
    description: 'Deep maritime depression with tight isobaric pressure gradient (982 hPa).',
    regime: 'High-Wind / Gale',
    locationId: 'sydney',
    leadTime: 12,
    whyText: 'NWP-A and Ensemble members are weighted heavily to capture cyclonic steering winds and chaotic peak gust distributions.'
  },
  {
    id: 'disagreement',
    name: 'Convective Bifurcation (Model Disagreement)',
    badge: 'High Uncertainty',
    description: 'AI model predicts localized storm cell while GFS predicts clear dry slot.',
    regime: 'Convective',
    locationId: 'singapore',
    leadTime: 48,
    whyText: 'Uncertainty bounds are expanded significantly (+/- 45%). Ensemble weight increases to buffer against deterministic divergence.'
  },
  {
    id: 'nwp_outage',
    name: 'Operational Fault (NWP-B Outage Simulation)',
    badge: 'Auto-Rebalanced',
    description: 'NOAA GFS-FV3 feed drops offline; blending engine instantly recalculates to 100%.',
    regime: 'Normal',
    locationId: 'newyork',
    leadTime: 24,
    modelModifications: {
      nwpB: { status: 'offline' }
    },
    whyText: 'NWP-B is offline. Its 22% weight is dynamically redistributed proportionally: AI 44%, NWP-A 38%, Ensemble 18%.'
  }
];
