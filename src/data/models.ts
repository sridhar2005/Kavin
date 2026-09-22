import { ModelMetadata } from '../types/weather';

export const METEOROLOGICAL_MODELS: Record<string, ModelMetadata> = {
  ai: {
    id: 'ai',
    name: 'AtmosML Neural-Graph',
    code: 'AI-ML',
    provider: 'Deep Learning Atmospheric Surrogate (GraphCast/FourCastNet)',
    type: 'AI/ML Model',
    resolution: '0.25° (~25 km)',
    baseHistoricalSkill: 92,
    color: '#8b5cf6', // Purple
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    status: 'online',
    leadTimeStrengths: 'Superior 0–48h synoptic tracking, rapid non-linear convective patterns, zero numerical diffusion.',
    description: 'Neural graph architecture trained on 40 years of ERA5 reanalysis and satellite radiances for hyper-fast spatial pattern interpolation.'
  },
  nwpA: {
    id: 'nwpA',
    name: 'EC-IFS High-Res',
    code: 'NWP-A',
    provider: 'European Centre for Medium-Range Weather Forecasts (IFS Cy48r1)',
    type: 'Physical NWP',
    resolution: '9 km Deterministic (137 vertical levels)',
    baseHistoricalSkill: 89,
    color: '#2563eb', // Royal Blue
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    status: 'online',
    leadTimeStrengths: 'Exceptional boundary-layer physics, high skill in heavy frontal precipitation and marine pressure gradients.',
    description: 'High-resolution hydrostatic physical primitive equations solver with advanced 4D-Var data assimilation.'
  },
  nwpB: {
    id: 'nwpB',
    name: 'NOAA GFS-FV3',
    code: 'NWP-B',
    provider: 'National Oceanic and Atmospheric Administration (FV3 Core)',
    type: 'Physical NWP',
    resolution: '13 km Global Spectral',
    baseHistoricalSkill: 84,
    color: '#06b6d4', // Cyan
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    status: 'online',
    leadTimeStrengths: 'Consistent thermodynamic profiles, reliable thermal convection and upper-level jet streak mapping.',
    description: 'Finite-Volume Cubed-Sphere dynamical core balancing global mass conservation and momentum transport.'
  },
  ensemble: {
    id: 'ensemble',
    name: 'Global Multi-EPS',
    code: 'ENS-50',
    provider: '50-Member Perturbed Atmospheric Ensemble',
    type: 'Ensemble NWP',
    resolution: '18 km (50 Perturbations)',
    baseHistoricalSkill: 86,
    color: '#10b981', // Emerald
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    status: 'online',
    leadTimeStrengths: 'Dominates 72h–120h lead times; captures tail probability distributions and chaotic bifurcation risks.',
    description: 'Stochastically perturbed physical tendencies (SPPT) generating probabilistic variance envelopes across 50 realization members.'
  }
};
