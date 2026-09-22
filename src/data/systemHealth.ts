import { DataQualityFeed } from '../types/weather';

export const SYSTEM_FEEDS_STATUS: DataQualityFeed[] = [
  {
    id: 'ai_feed',
    name: 'AtmosML Neural Inference Pipeline',
    status: 'optimal',
    latency: '340 ms',
    missingRate: '0.00%',
    outliersDetected: 0,
    lastSync: '2 mins ago (Cycle 12Z)',
    source: 'Surrogate Tensor Core Cluster'
  },
  {
    id: 'ecmwf_feed',
    name: 'ECMWF IFS High-Res 9km Data Stream',
    status: 'optimal',
    latency: '890 ms',
    missingRate: '0.01%',
    outliersDetected: 1,
    lastSync: '14 mins ago (Cycle 06Z)',
    source: 'EUMETSAT / ECMWF Open Data GRIB2'
  },
  {
    id: 'gfs_feed',
    name: 'NOAA GFS-FV3 Spectral GRIB Feed',
    status: 'optimal',
    latency: '1.2 s',
    missingRate: '0.04%',
    outliersDetected: 2,
    lastSync: '22 mins ago (Cycle 06Z)',
    source: 'NOAA NCEP NOMADS HTTP'
  },
  {
    id: 'ensemble_feed',
    name: 'Multi-EPS 50-Member Probabilistic Feed',
    status: 'optimal',
    latency: '2.4 s',
    missingRate: '0.02%',
    outliersDetected: 0,
    lastSync: '30 mins ago (Cycle 00Z)',
    source: 'Global Ensemble Staging Hub'
  },
  {
    id: 'surface_obs',
    name: 'WMO GTS Surface Synoptic Station Array',
    status: 'optimal',
    latency: '110 ms',
    missingRate: '0.12%',
    outliersDetected: 3,
    lastSync: '1 min ago (Real-time METAR)',
    source: 'Global Telecommunication System'
  }
];
