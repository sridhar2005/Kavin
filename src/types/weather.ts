export type ModelId = 'ai' | 'nwpA' | 'nwpB' | 'ensemble';

export type WeatherRegime = 
  | 'Normal'
  | 'Monsoon'
  | 'Heavy Rainfall'
  | 'Convective'
  | 'Dry / Stable'
  | 'Heat-Wave'
  | 'High-Wind / Gale'
  | 'Storm-Risk'
  | 'Transitional';

export type ForecastVariable = 
  | 'rainfall'
  | 'temperature'
  | 'wind'
  | 'extreme_rain'
  | 'heat_wave'
  | 'high_wind';

export type LeadTimeHours = 0 | 6 | 12 | 24 | 48 | 72 | 120;

export type AgreementLevel = 'strong' | 'moderate' | 'disagreement';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';
export type ModelStatus = 'online' | 'degraded' | 'offline';

export interface ModelMetadata {
  id: ModelId;
  name: string;
  code: string;
  provider: string;
  type: 'AI/ML Model' | 'Physical NWP' | 'Ensemble NWP';
  resolution: string;
  baseHistoricalSkill: number; // 0-100%
  color: string;
  bgColor: string;
  borderColor: string;
  status: ModelStatus;
  leadTimeStrengths: string;
  description: string;
}

export interface GeoLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  elevation: number;
  climateZone: string;
  defaultRegime: WeatherRegime;
}

export interface ModelForecastPoint {
  leadTime: LeadTimeHours;
  timeLabel: string;
  ai: number;
  nwpA: number;
  nwpB: number;
  ensemble: number;
  observed?: number; // Ground truth observation when available (e.g. past hours)
}

export interface ModelContribution {
  modelId: ModelId;
  modelName: string;
  type: string;
  color: string;
  predictedValue: number;
  historicalSkill: number; // e.g. 91%
  currentReliability: 'High' | 'Medium' | 'Low';
  reliabilityFactor: number; // 0.0 - 1.0
  regimeMultiplier: number;
  leadTimeMultiplier: number;
  adaptiveWeight: number; // e.g. 0.35 (sums to 1.0 across active models)
  finalContribution: number; // predictedValue * adaptiveWeight
  isOnline: boolean;
}

export interface ExplainabilityBreakdown {
  historicalSkillWeight: number; // e.g. 35%
  modelAgreementWeight: number; // e.g. 25%
  weatherRegimeWeight: number; // e.g. 20%
  leadTimeDecayWeight: number; // e.g. 10%
  regionalPerformanceWeight: number; // e.g. 10%
  summaryText: string;
  dominantModel: ModelId;
  keyDrivingFactor: string;
}

export interface BlendedForecastResult {
  variable: ForecastVariable;
  unit: string;
  leadTime: LeadTimeHours;
  timeLabel: string;
  blendedValue: number;
  uncertaintyRange: {
    lower: number;
    upper: number;
    spread: number;
  };
  confidencePercent: number; // 0-100
  confidenceLevel: 'High Confidence' | 'Moderate Confidence' | 'Low Confidence';
  confidenceReason: string;
  agreementLevel: AgreementLevel;
  agreementScore: number; // 0-100%
  detectedRegime: WeatherRegime;
  regimeDescription: string;
  contributions: ModelContribution[];
  explainability: ExplainabilityBreakdown;
}

export interface ExtremeRiskItem {
  id: string;
  category: 'Heavy Rainfall' | 'Heat Wave' | 'High Wind' | 'Severe Storm';
  riskLevel: RiskLevel;
  probability: number; // 0-100%
  expectedValue: string;
  anomalyText: string;
  expectedDuration: string;
  peakLeadTime: string;
  advisory: string;
  actionRequired: boolean;
}

export interface ModelAccuracyMetric {
  modelId: ModelId | 'hybrid';
  name: string;
  type: string;
  color: string;
  rmse: number;
  mae: number;
  bias: number;
  correlation: number;
  brierScore: number;
  skillScore: number;
  crps: number;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  regime: WeatherRegime;
  locationId: string;
  leadTime: LeadTimeHours;
  modelModifications?: Partial<Record<ModelId, { status?: ModelStatus; biasShift?: number; skillMultiplier?: number }>>;
  whyText: string;
}

export interface DataQualityFeed {
  id: string;
  name: string;
  status: 'optimal' | 'stable' | 'delayed' | 'offline';
  latency: string;
  missingRate: string;
  outliersDetected: number;
  lastSync: string;
  source: string;
}
