import { ModelAccuracyMetric } from '../types/weather';

export const HISTORICAL_ACCURACY_DATA: ModelAccuracyMetric[] = [
  {
    modelId: 'hybrid',
    name: 'AuraBlend Hybrid (Ours)',
    type: 'Adaptive Blended Ensemble',
    color: '#4f46e5',
    rmse: 1.42, // Lower is better
    mae: 1.08,
    bias: -0.04,
    correlation: 0.94,
    brierScore: 0.082,
    skillScore: 94.2,
    crps: 0.82
  },
  {
    modelId: 'ai',
    name: 'AtmosML Neural-Graph',
    type: 'AI/ML Surrogate',
    color: '#8b5cf6',
    rmse: 1.68,
    mae: 1.25,
    bias: 0.12,
    correlation: 0.91,
    brierScore: 0.104,
    skillScore: 90.5,
    crps: 0.95
  },
  {
    modelId: 'nwpA',
    name: 'EC-IFS High-Res',
    type: 'Physical NWP',
    color: '#2563eb',
    rmse: 1.84,
    mae: 1.39,
    bias: -0.18,
    correlation: 0.89,
    brierScore: 0.118,
    skillScore: 88.1,
    crps: 1.05
  },
  {
    modelId: 'ensemble',
    name: 'Global Multi-EPS',
    type: 'Ensemble NWP',
    color: '#10b981',
    rmse: 2.05,
    mae: 1.55,
    bias: 0.06,
    correlation: 0.86,
    brierScore: 0.125,
    skillScore: 85.4,
    crps: 1.12
  },
  {
    modelId: 'nwpB',
    name: 'NOAA GFS-FV3',
    type: 'Physical NWP',
    color: '#06b6d4',
    rmse: 2.22,
    mae: 1.68,
    bias: 0.31,
    correlation: 0.83,
    brierScore: 0.142,
    skillScore: 82.0,
    crps: 1.24
  }
];

export interface LeadTimeErrorCurve {
  leadTime: string;
  hybrid: number;
  ai: number;
  nwpA: number;
  nwpB: number;
  ensemble: number;
}

export const LEAD_TIME_RMSE_TRENDS: LeadTimeErrorCurve[] = [
  { leadTime: '6h', hybrid: 0.82, ai: 0.95, nwpA: 1.15, nwpB: 1.40, ensemble: 1.30 },
  { leadTime: '12h', hybrid: 1.10, ai: 1.25, nwpA: 1.42, nwpB: 1.75, ensemble: 1.55 },
  { leadTime: '24h', hybrid: 1.42, ai: 1.68, nwpA: 1.84, nwpB: 2.22, ensemble: 2.05 },
  { leadTime: '48h', hybrid: 1.95, ai: 2.30, nwpA: 2.45, nwpB: 2.85, ensemble: 2.50 },
  { leadTime: '72h', hybrid: 2.45, ai: 3.10, nwpA: 2.95, nwpB: 3.50, ensemble: 2.85 },
  { leadTime: '120h', hybrid: 3.10, ai: 4.20, nwpA: 3.80, nwpB: 4.60, ensemble: 3.40 }
];

export interface ObservedComparisonPoint {
  timeLabel: string;
  observed: number;
  hybrid: number;
  ai: number;
  nwpA: number;
  nwpB: number;
  ensemble: number;
}

export const RAINFALL_VERIFICATION_SERIES: ObservedComparisonPoint[] = [
  { timeLabel: 'Day -5', observed: 12.4, hybrid: 13.0, ai: 14.1, nwpA: 11.5, nwpB: 8.8, ensemble: 12.0 },
  { timeLabel: 'Day -4', observed: 45.2, hybrid: 43.8, ai: 48.0, nwpA: 41.2, nwpB: 36.5, ensemble: 39.0 },
  { timeLabel: 'Day -3', observed: 88.6, hybrid: 86.4, ai: 92.5, nwpA: 84.0, nwpB: 72.0, ensemble: 79.5 },
  { timeLabel: 'Day -2', observed: 34.0, hybrid: 35.1, ai: 38.2, nwpA: 33.5, nwpB: 42.0, ensemble: 36.0 },
  { timeLabel: 'Day -1', observed: 5.8, hybrid: 6.2, ai: 7.0, nwpA: 5.5, nwpB: 9.2, ensemble: 6.8 },
  { timeLabel: 'Today (T0)', observed: 28.5, hybrid: 28.0, ai: 31.0, nwpA: 27.5, nwpB: 22.0, ensemble: 26.5 }
];
