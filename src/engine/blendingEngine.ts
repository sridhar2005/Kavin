import {
  ModelId,
  WeatherRegime,
  ForecastVariable,
  LeadTimeHours,
  GeoLocation,
  ModelContribution,
  BlendedForecastResult,
  ExplainabilityBreakdown,
  ModelStatus
} from '../types/weather';
import { METEOROLOGICAL_MODELS } from '../data/models';
import { detectWeatherRegime } from './regimeDetector';

export interface BlendingOptions {
  location: GeoLocation;
  leadTime: LeadTimeHours;
  variable: ForecastVariable;
  scenarioRegime?: WeatherRegime;
  customModelStatus?: Partial<Record<ModelId, ModelStatus>>;
  customModelReliability?: Partial<Record<ModelId, number>>; // 0.0 - 2.0 multiplier
  customPredictions?: Partial<Record<ModelId, number>>;
}

/**
 * Base raw predictions generator for simulation
 */
export function getSimulatedModelPredictions(
  variable: ForecastVariable,
  leadTime: LeadTimeHours,
  location: GeoLocation,
  regime: WeatherRegime
): Record<ModelId, number> {
  // Deterministic baseline anchored on location & regime
  let baseVal = 0;

  switch (variable) {
    case 'rainfall': {
      if (regime === 'Heavy Rainfall') baseVal = 74;
      else if (regime === 'Monsoon') baseVal = 42;
      else if (regime === 'Convective') baseVal = 18;
      else if (regime === 'Dry / Stable') baseVal = 0.2;
      else baseVal = 6.5;
      break;
    }
    case 'temperature': {
      if (regime === 'Heat-Wave') baseVal = 39.5;
      else if (location.climateZone.includes('Equatorial')) baseVal = 31.0;
      else if (location.elevation > 1000) baseVal = 20.5;
      else baseVal = 24.5;
      break;
    }
    case 'wind': {
      if (regime === 'High-Wind / Gale') baseVal = 68;
      else if (regime === 'Storm-Risk') baseVal = 45;
      else if (location.climateZone.includes('Coastal')) baseVal = 28;
      else baseVal = 16;
      break;
    }
    case 'extreme_rain': {
      if (regime === 'Heavy Rainfall') baseVal = 88;
      else if (regime === 'Monsoon') baseVal = 65;
      else baseVal = 12;
      break;
    }
    case 'heat_wave': {
      if (regime === 'Heat-Wave') baseVal = 85;
      else if (regime === 'Dry / Stable') baseVal = 35;
      else baseVal = 8;
      break;
    }
    case 'high_wind': {
      if (regime === 'High-Wind / Gale') baseVal = 90;
      else if (regime === 'Storm-Risk') baseVal = 70;
      else baseVal = 15;
      break;
    }
  }

  // Lead-time drift factor
  const ltFactor = 1 + (leadTime / 120) * 0.08;

  // Realistic per-model variations based on known physics characteristics
  if (variable === 'rainfall') {
    return {
      ai: Number((baseVal * 1.06 * ltFactor).toFixed(1)),
      nwpA: Number((baseVal * 0.96 * ltFactor).toFixed(1)),
      nwpB: Number((baseVal * 0.82 * ltFactor).toFixed(1)),
      ensemble: Number((baseVal * 0.92 * ltFactor).toFixed(1))
    };
  } else if (variable === 'temperature') {
    return {
      ai: Number((baseVal + 0.4 + (leadTime * 0.01)).toFixed(1)),
      nwpA: Number((baseVal - 0.3).toFixed(1)),
      nwpB: Number((baseVal + 0.8).toFixed(1)),
      ensemble: Number((baseVal + 0.1).toFixed(1))
    };
  } else if (variable === 'wind') {
    return {
      ai: Number((baseVal * 0.98 + 2).toFixed(1)),
      nwpA: Number((baseVal * 1.04).toFixed(1)),
      nwpB: Number((baseVal * 0.90 - 1).toFixed(1)),
      ensemble: Number((baseVal * 1.01).toFixed(1))
    };
  } else {
    // Probability indicators (0-100%)
    return {
      ai: Math.min(99, Math.max(1, Math.round(baseVal * 1.05))),
      nwpA: Math.min(99, Math.max(1, Math.round(baseVal * 0.97))),
      nwpB: Math.min(99, Math.max(1, Math.round(baseVal * 0.88))),
      ensemble: Math.min(99, Math.max(1, Math.round(baseVal * 1.01)))
    };
  }
}

/**
 * Lead-time weighting decay / boost curve
 * AI models excel in 0-36h. Ensembles excel in 48-120h. NWP is robust across 12-72h.
 */
export function getLeadTimeMultiplier(modelId: ModelId, leadTime: LeadTimeHours): number {
  switch (modelId) {
    case 'ai':
      if (leadTime <= 12) return 1.35;
      if (leadTime <= 24) return 1.20;
      if (leadTime <= 48) return 1.00;
      if (leadTime <= 72) return 0.82;
      return 0.65; // Decays at 120h
    case 'nwpA':
      if (leadTime <= 12) return 1.05;
      if (leadTime <= 24) return 1.15;
      if (leadTime <= 48) return 1.20;
      if (leadTime <= 72) return 1.10;
      return 0.95;
    case 'nwpB':
      if (leadTime <= 12) return 0.95;
      if (leadTime <= 24) return 1.00;
      if (leadTime <= 48) return 1.05;
      if (leadTime <= 72) return 0.98;
      return 0.88;
    case 'ensemble':
      if (leadTime <= 12) return 0.80;
      if (leadTime <= 24) return 0.90;
      if (leadTime <= 48) return 1.15;
      if (leadTime <= 72) return 1.35;
      return 1.55; // Highly dominant at 120h
  }
}

/**
 * Regime-specific model skill boost multiplier
 */
export function getRegimeMultiplier(modelId: ModelId, regime: WeatherRegime): number {
  switch (regime) {
    case 'Heavy Rainfall':
    case 'Monsoon':
      if (modelId === 'nwpA') return 1.30; // High resolution IFS boundary layer physics
      if (modelId === 'ai') return 1.15;
      if (modelId === 'ensemble') return 1.10;
      return 0.85;
    case 'Heat-Wave':
    case 'Dry / Stable':
      if (modelId === 'ai') return 1.30; // Excellent surface heating mapping
      if (modelId === 'nwpB') return 1.10;
      if (modelId === 'nwpA') return 1.05;
      return 0.90;
    case 'High-Wind / Gale':
    case 'Storm-Risk':
      if (modelId === 'nwpA') return 1.25;
      if (modelId === 'ensemble') return 1.25;
      if (modelId === 'ai') return 1.05;
      return 0.90;
    case 'Convective':
      if (modelId === 'ai') return 1.25;
      if (modelId === 'nwpA') return 1.15;
      if (modelId === 'ensemble') return 1.20;
      return 0.80;
    case 'Transitional':
    case 'Normal':
    default:
      return 1.00;
  }
}

/**
 * Main Blending Calculation Pipeline
 */
export function computeHybridForecast(options: BlendingOptions): BlendedForecastResult {
  const {
    location,
    leadTime,
    variable,
    scenarioRegime,
    customModelStatus = {},
    customModelReliability = {},
    customPredictions = {}
  } = options;

  // 1. Detect / retrieve active regime
  const simulatedRaw = getSimulatedModelPredictions(variable, leadTime, location, scenarioRegime || location.defaultRegime);
  const regimeInfo = detectWeatherRegime(
    {
      rainfallMm: simulatedRaw.ai,
      temperatureC: 25,
      windSpeedKmh: 20
    },
    location,
    scenarioRegime
  );

  const modelIds: ModelId[] = ['ai', 'nwpA', 'nwpB', 'ensemble'];
  const rawWeights: Record<ModelId, number> = {} as any;
  const modelConts: ModelContribution[] = [];

  // 2. Calculate raw un-normalized weights
  let totalRawWeight = 0;

  modelIds.forEach((id) => {
    const meta = METEOROLOGICAL_MODELS[id];
    const status = customModelStatus[id] || meta.status;
    const isOnline = status === 'online';
    const relFactor = customModelReliability[id] !== undefined ? customModelReliability[id]! : 1.0;

    const baseSkillScore = meta.baseHistoricalSkill; // e.g. 92
    const leadTimeMult = getLeadTimeMultiplier(id, leadTime);
    const regimeMult = getRegimeMultiplier(id, regimeInfo.regime);

    // If offline, weight is 0
    const rawWeight = isOnline ? (baseSkillScore * leadTimeMult * regimeMult * relFactor) : 0;
    rawWeights[id] = rawWeight;
    totalRawWeight += rawWeight;
  });

  // Safe fallback if all models offline
  if (totalRawWeight === 0) {
    totalRawWeight = 1;
    rawWeights.ai = 1;
  }

  // 3. Normalize weights to sum exactly to 1.000
  let blendedVal = 0;
  const values: number[] = [];

  modelIds.forEach((id) => {
    const meta = METEOROLOGICAL_MODELS[id];
    const status = customModelStatus[id] || meta.status;
    const isOnline = status === 'online';
    const predValue = customPredictions[id] !== undefined ? customPredictions[id]! : simulatedRaw[id];
    const normalizedWeight = rawWeights[id] / totalRawWeight;

    const contribution = predValue * normalizedWeight;
    if (isOnline) {
      blendedVal += contribution;
      values.push(predValue);
    }

    const relLabel: 'High' | 'Medium' | 'Low' = 
      !isOnline ? 'Low' : 
      meta.baseHistoricalSkill >= 88 ? 'High' : 
      meta.baseHistoricalSkill >= 80 ? 'Medium' : 'Low';

    modelConts.push({
      modelId: id,
      modelName: meta.name,
      type: meta.type,
      color: meta.color,
      predictedValue: predValue,
      historicalSkill: meta.baseHistoricalSkill,
      currentReliability: relLabel,
      reliabilityFactor: customModelReliability[id] !== undefined ? customModelReliability[id]! : 1.0,
      regimeMultiplier: getRegimeMultiplier(id, regimeInfo.regime),
      leadTimeMultiplier: getLeadTimeMultiplier(id, leadTime),
      adaptiveWeight: Number(normalizedWeight.toFixed(3)),
      finalContribution: Number(contribution.toFixed(2)),
      isOnline
    });
  });

  // 4. Inter-model variance & uncertainty bounds calculation
  const n = values.length || 1;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Lead-time uncertainty inflation factor
  const leadTimeUncertaintySpread = (1 + leadTime / 48) * (stdDev || (mean * 0.1) || 1.2);
  
  const unit = 
    variable === 'rainfall' ? 'mm' :
    variable === 'temperature' ? '°C' :
    variable === 'wind' ? 'km/h' : '%';

  const lowerBound = Math.max(0, Number((blendedVal - leadTimeUncertaintySpread * 0.9).toFixed(1)));
  const upperBound = Number((blendedVal + leadTimeUncertaintySpread * 1.1).toFixed(1));

  // 5. Model Agreement & Confidence Scoring
  const normalizedSpread = mean > 0 ? (stdDev / (mean + 0.01)) : 0.1;
  let agreementScore = Math.max(15, Math.min(98, Math.round(100 - (normalizedSpread * 110))));
  if (values.length <= 2) agreementScore = Math.min(agreementScore, 65);

  const agreementLevel = 
    agreementScore >= 80 ? 'strong' :
    agreementScore >= 55 ? 'moderate' : 'disagreement';

  // Confidence calculation factoring lead time decay and active model count
  const leadTimeDecay = Math.max(0.6, 1 - (leadTime / 240));
  const activeModelRatio = values.length / 4;
  const confidencePercent = Math.min(96, Math.max(25, Math.round(agreementScore * 0.65 * leadTimeDecay + (activeModelRatio * 35))));

  const confidenceLevel = 
    confidencePercent >= 80 ? 'High Confidence' :
    confidencePercent >= 60 ? 'Moderate Confidence' : 'Low Confidence';

  let confidenceReason = '';
  if (confidenceLevel === 'High Confidence') {
    confidenceReason = `Strong multi-model convergence (${agreementScore}%) with verified historical skill in ${location.name}. High atmospheric state predictability.`;
  } else if (confidenceLevel === 'Moderate Confidence') {
    confidenceReason = `Moderate dispersion across models at +${leadTime}h lead time. Ensemble weights are dynamically elevated to hedge against divergence.`;
  } else {
    confidenceReason = `Significant model spread detected under dynamic ${regimeInfo.regime} conditions or model unavailability. Broader uncertainty envelope recommended.`;
  }

  // 6. Dominant Model & Explainability breakdown
  const dominant = [...modelConts].sort((a, b) => b.adaptiveWeight - a.adaptiveWeight)[0];
  
  let summaryExplainText = '';
  if (dominant.modelId === 'ai') {
    summaryExplainText = `Forecast is predominantly steered by AtmosML Neural-Graph (${Math.round(dominant.adaptiveWeight * 100)}% weight) due to high short-range synoptic skill and rapid convective spatial pattern recognition at +${leadTime}h.`;
  } else if (dominant.modelId === 'nwpA') {
    summaryExplainText = `Forecast is primarily weighted by EC-IFS High-Res (${Math.round(dominant.adaptiveWeight * 100)}% weight) owing to proven hydrodynamic boundary-layer skill in ${regimeInfo.regime} regimes.`;
  } else if (dominant.modelId === 'ensemble') {
    summaryExplainText = `Forecast is anchored by Global Multi-EPS (${Math.round(dominant.adaptiveWeight * 100)}% weight) to suppress non-linear deterministic chaos at extended lead time (+${leadTime}h).`;
  } else {
    summaryExplainText = `Forecast features a balanced multi-model synthesis with NOAA GFS-FV3 contributing (${Math.round(dominant.adaptiveWeight * 100)}% weight) alongside adjacent dynamical cores.`;
  }

  const explainability: ExplainabilityBreakdown = {
    historicalSkillWeight: 35,
    modelAgreementWeight: 25,
    weatherRegimeWeight: 20,
    leadTimeDecayWeight: 10,
    regionalPerformanceWeight: 10,
    summaryText: summaryExplainText,
    dominantModel: dominant.modelId,
    keyDrivingFactor: `${regimeInfo.regime} regime + Lead time (+${leadTime}h)`
  };

  return {
    variable,
    unit,
    leadTime,
    timeLabel: leadTime === 0 ? 'Current (Now)' : `+${leadTime}h Lead Time`,
    blendedValue: Number(blendedVal.toFixed(1)),
    uncertaintyRange: {
      lower: lowerBound,
      upper: upperBound,
      spread: Number((upperBound - lowerBound).toFixed(1))
    },
    confidencePercent,
    confidenceLevel,
    confidenceReason,
    agreementLevel,
    agreementScore,
    detectedRegime: regimeInfo.regime,
    regimeDescription: regimeInfo.description,
    contributions: modelConts,
    explainability
  };
}

/**
 * Computes multi-lead-time series for interactive charts (0h, 6h, 12h, 24h, 48h, 72h, 120h)
 */
export function computeTimeSeriesForecast(
  location: GeoLocation,
  variable: ForecastVariable,
  scenarioRegime?: WeatherRegime,
  customModelStatus?: Partial<Record<ModelId, ModelStatus>>
) {
  const leadTimes: LeadTimeHours[] = [0, 6, 12, 24, 48, 72, 120];

  return leadTimes.map((lt) => {
    const result = computeHybridForecast({
      location,
      leadTime: lt,
      variable,
      scenarioRegime,
      customModelStatus
    });

    const aiVal = result.contributions.find(c => c.modelId === 'ai')?.predictedValue ?? 0;
    const nwpAVal = result.contributions.find(c => c.modelId === 'nwpA')?.predictedValue ?? 0;
    const nwpBVal = result.contributions.find(c => c.modelId === 'nwpB')?.predictedValue ?? 0;
    const ensVal = result.contributions.find(c => c.modelId === 'ensemble')?.predictedValue ?? 0;

    return {
      leadTime: lt,
      timeLabel: lt === 0 ? 'Now' : `+${lt}h`,
      hybrid: result.blendedValue,
      lowerBound: result.uncertaintyRange.lower,
      upperBound: result.uncertaintyRange.upper,
      ai: aiVal,
      nwpA: nwpAVal,
      nwpB: nwpBVal,
      ensemble: ensVal,
      confidence: result.confidencePercent,
      agreement: result.agreementScore,
      aiWeight: Math.round((result.contributions.find(c => c.modelId === 'ai')?.adaptiveWeight ?? 0) * 100),
      nwpAWeight: Math.round((result.contributions.find(c => c.modelId === 'nwpA')?.adaptiveWeight ?? 0) * 100),
      nwpBWeight: Math.round((result.contributions.find(c => c.modelId === 'nwpB')?.adaptiveWeight ?? 0) * 100),
      ensWeight: Math.round((result.contributions.find(c => c.modelId === 'ensemble')?.adaptiveWeight ?? 0) * 100)
    };
  });
}
