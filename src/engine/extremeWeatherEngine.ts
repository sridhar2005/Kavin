import { ExtremeRiskItem, WeatherRegime, GeoLocation, RiskLevel } from '../types/weather';
import { computeHybridForecast } from './blendingEngine';

export interface UserAlertThresholds {
  rainfallWarningMm: number;
  rainfallSevereMm: number;
  tempWarningC: number;
  tempSevereC: number;
  windWarningKmh: number;
  windSevereKmh: number;
}

export const DEFAULT_THRESHOLDS: UserAlertThresholds = {
  rainfallWarningMm: 35,
  rainfallSevereMm: 65,
  tempWarningC: 36,
  tempSevereC: 40,
  windWarningKmh: 50,
  windSevereKmh: 75,
};

export function evaluateExtremeRisks(
  location: GeoLocation,
  regime: WeatherRegime,
  thresholds: UserAlertThresholds = DEFAULT_THRESHOLDS
): ExtremeRiskItem[] {
  const rainBlend = computeHybridForecast({ location, leadTime: 24, variable: 'rainfall', scenarioRegime: regime }).blendedValue;
  const tempBlend = computeHybridForecast({ location, leadTime: 24, variable: 'temperature', scenarioRegime: regime }).blendedValue;
  const windBlend = computeHybridForecast({ location, leadTime: 24, variable: 'wind', scenarioRegime: regime }).blendedValue;

  const risks: ExtremeRiskItem[] = [];

  // 1. Heavy Rainfall
  let rainRisk: RiskLevel = 'low';
  let rainProb = 12;
  if (rainBlend >= thresholds.rainfallSevereMm || regime === 'Heavy Rainfall') {
    rainRisk = 'severe';
    rainProb = 92;
  } else if (rainBlend >= thresholds.rainfallWarningMm || regime === 'Monsoon') {
    rainRisk = 'high';
    rainProb = 78;
  } else if (rainBlend > 15) {
    rainRisk = 'moderate';
    rainProb = 48;
  }

  risks.push({
    id: 'heavy_rain',
    category: 'Heavy Rainfall',
    riskLevel: rainRisk,
    probability: rainProb,
    expectedValue: `${rainBlend.toFixed(1)} mm`,
    anomalyText: rainBlend > 40 ? '+240% above seasonal baseline' : 'Normal seasonal accumulation',
    expectedDuration: rainRisk === 'severe' ? '18–36 hours continuous' : '6–12 hours episodic',
    peakLeadTime: '+12h to +24h',
    advisory: rainRisk === 'severe' 
      ? 'CRITICAL ADVISORY: High probability of flash flooding, urban inundation, and storm drain overflow. Issue hydrological warnings.'
      : rainRisk === 'high' 
      ? 'MODERATE ADVISORY: Localized waterlogging possible in low-lying basins. Monitor convective radar.'
      : 'No critical rainfall hazards projected over the 72h window.',
    actionRequired: rainRisk === 'severe' || rainRisk === 'high'
  });

  // 2. Heat Wave
  let tempRisk: RiskLevel = 'low';
  let tempProb = 8;
  if (tempBlend >= thresholds.tempSevereC || (regime === 'Heat-Wave' && tempBlend > 38)) {
    tempRisk = 'severe';
    tempProb = 95;
  } else if (tempBlend >= thresholds.tempWarningC || regime === 'Heat-Wave') {
    tempRisk = 'high';
    tempProb = 82;
  } else if (tempBlend > 32) {
    tempRisk = 'moderate';
    tempProb = 42;
  }

  risks.push({
    id: 'heat_wave',
    category: 'Heat Wave',
    riskLevel: tempRisk,
    probability: tempProb,
    expectedValue: `${tempBlend.toFixed(1)} °C`,
    anomalyText: tempBlend > 36 ? `+${(tempBlend - 30).toFixed(1)}°C positive thermal anomaly` : 'Near climatological mean',
    expectedDuration: tempRisk === 'severe' ? '3–5 days persistent ridge' : '1–2 days afternoon peak',
    peakLeadTime: '+24h to +48h',
    advisory: tempRisk === 'severe'
      ? 'EXTREME THERMAL ALERT: Dangerous Wet-Bulb Globe Temperature. Elevated heat-stroke risk for vulnerable populations.'
      : tempRisk === 'high'
      ? 'HEAT ADVISORY: High surface temperatures during 12:00–16:00 local time. Hydration precautions advised.'
      : 'Normal thermal comfort profile across the forecast horizon.',
    actionRequired: tempRisk === 'severe' || tempRisk === 'high'
  });

  // 3. High Wind / Gale
  let windRisk: RiskLevel = 'low';
  let windProb = 10;
  if (windBlend >= thresholds.windSevereKmh || (regime === 'High-Wind / Gale' && windBlend > 60)) {
    windRisk = 'severe';
    windProb = 89;
  } else if (windBlend >= thresholds.windWarningKmh || regime === 'High-Wind / Gale') {
    windRisk = 'high';
    windProb = 74;
  } else if (windBlend > 35) {
    windRisk = 'moderate';
    windProb = 40;
  }

  risks.push({
    id: 'high_wind',
    category: 'High Wind',
    riskLevel: windRisk,
    probability: windProb,
    expectedValue: `${windBlend.toFixed(1)} km/h`,
    anomalyText: windBlend > 50 ? `Peak gusts to ${(windBlend * 1.35).toFixed(0)} km/h` : 'Standard boundary-layer wind',
    expectedDuration: windRisk === 'severe' ? '12–24 hours storm passage' : 'Sporadic convective gusts',
    peakLeadTime: '+12h',
    advisory: windRisk === 'severe'
      ? 'GALE FORCE WARNING: Structural stress on light installations, marine hazard, and localized tree fall danger.'
      : windRisk === 'high'
      ? 'WIND ADVISORY: Gusty cross-winds on exposed bridges and elevated terrains.'
      : 'Calm to moderate synoptic winds expected.',
    actionRequired: windRisk === 'severe' || windRisk === 'high'
  });

  return risks;
}
