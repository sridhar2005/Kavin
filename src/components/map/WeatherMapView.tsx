import React, { useState } from 'react';
import { 
  GeoLocation, 
  LeadTimeHours, 
  WeatherRegime, 
  ForecastVariable 
} from '../../types/weather';
import { GLOBAL_LOCATIONS } from '../../data/locations';
import { computeHybridForecast } from '../../engine/blendingEngine';
import { 
  Layers, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Sliders, 
  Info,
  Maximize2,
  Minimize2,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { UncertaintyBadge, ConfidenceBadge, AgreementBadge } from '../common/Badges';

interface WeatherMapViewProps {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  leadTime: LeadTimeHours;
  onChangeLeadTime: (lt: LeadTimeHours) => void;
  regime: WeatherRegime;
}

type MapLayerType = 'dominance' | 'rainfall' | 'temperature' | 'wind' | 'confidence' | 'risk';

export function WeatherMapView({
  currentLocation,
  onSelectLocation,
  leadTime,
  onChangeLeadTime,
  regime
}: WeatherMapViewProps) {
  const [selectedLayer, setSelectedLayer] = useState<MapLayerType>('dominance');
  const [inspectedLocation, setInspectedLocation] = useState<GeoLocation>(currentLocation);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const inspectedBlend = computeHybridForecast({
    location: inspectedLocation,
    leadTime,
    variable: selectedLayer === 'temperature' ? 'temperature' : selectedLayer === 'wind' ? 'wind' : 'rainfall',
    scenarioRegime: inspectedLocation.defaultRegime
  });

  const dominantModel = inspectedBlend.explainability.dominantModel;

  // Map layers metadata
  const layers = [
    { id: 'dominance', label: 'Model Dominance', icon: Sliders, desc: 'Which model holds highest dynamic weight' },
    { id: 'rainfall', label: 'Precipitation Blend', icon: CloudRain, desc: 'Synthesized multi-model rainfall accumulation' },
    { id: 'temperature', label: 'Surface Temperature', icon: Thermometer, desc: 'Blended 2m thermal isotherms' },
    { id: 'wind', label: 'Wind Vector Fields', icon: Wind, desc: 'Streamlines and sustained gale vectors' },
    { id: 'confidence', label: 'Forecast Confidence', icon: ShieldCheck, desc: 'Spatial agreement and predictability index' },
  ];

  // Helper to determine dominant model per location for visual styling
  const getLocationDominantModel = (loc: GeoLocation) => {
    const res = computeHybridForecast({
      location: loc,
      leadTime,
      variable: 'rainfall',
      scenarioRegime: loc.defaultRegime
    });
    return res.explainability.dominantModel;
  };

  return (
    <div className={`space-y-6 animate-fadeIn ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/90 p-4 sm:p-8 backdrop-blur-md overflow-y-auto' : ''}`}>
      
      {/* Header & Layer Controls */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs uppercase shadow-xs">
                Spatial Weather Intelligence
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
                T+{leadTime}h Horizon
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Interactive Model Weight & Meteorological Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualize regional model dominance, spatial convergence, and localized blending weights across global synoptic stations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Active Map Layer:
          </span>
          {layers.map((l) => {
            const Icon = l.icon;
            const isSelected = selectedLayer === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedLayer(l.id as MapLayerType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Stylized Meteorological Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between relative overflow-hidden min-h-[460px] bg-slate-950 text-white">
          
          {/* Background Map Grid & Atmospheric Flow Animation */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* Top Canvas Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                Global Synthesis Radar Grid
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800">
              Layer: {layers.find(l => l.id === selectedLayer)?.label} (Lead Time: +{leadTime}h)
            </div>
          </div>

          {/* Interactive World Station Nodes Canvas */}
          <div className="relative z-10 my-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GLOBAL_LOCATIONS.map((loc) => {
              const dom = getLocationDominantModel(loc);
              const isInspected = inspectedLocation.id === loc.id;
              const isCurrent = currentLocation.id === loc.id;

              const domColor = 
                dom === 'ai' ? 'border-purple-500 bg-purple-950/70 text-purple-200' :
                dom === 'nwpA' ? 'border-blue-500 bg-blue-950/70 text-blue-200' :
                dom === 'nwpB' ? 'border-cyan-500 bg-cyan-950/70 text-cyan-200' :
                'border-emerald-500 bg-emerald-950/70 text-emerald-200';

              const domLabel = 
                dom === 'ai' ? 'AtmosML (AI)' :
                dom === 'nwpA' ? 'EC-IFS (NWP)' :
                dom === 'nwpB' ? 'GFS (NWP)' : 'Multi-EPS';

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setInspectedLocation(loc);
                    onSelectLocation(loc);
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer group relative ${domColor} ${
                    isInspected ? 'ring-4 ring-cyan-400/50 scale-105 shadow-xl' : 'hover:scale-102 hover:border-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">{loc.name}</span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  <div className="text-[10px] text-slate-300 line-clamp-1">{loc.country}</div>
                  
                  {/* Dominant model badge */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] flex items-center justify-between font-mono">
                    <span className="opacity-75">Dominant:</span>
                    <span className="font-bold">{domLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend Overlay */}
          <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Dominance Legend:</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>AI (AtmosML)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>NWP-A (EC-IFS)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>NWP-B (GFS)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Multi-EPS</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Click any location node to inspect localized blending weights</span>
          </div>

        </div>

        {/* Localized Inspection Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {inspectedLocation.name}, {inspectedLocation.country}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Lat: {inspectedLocation.lat}°, Lon: {inspectedLocation.lon}°
                  </p>
                </div>
              </div>
              <ConfidenceBadge percent={inspectedBlend.confidencePercent} level={inspectedBlend.confidenceLevel} />
            </div>

            {/* Local Blended Metric */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs mb-4">
              <div className="text-[10px] uppercase font-bold text-blue-700">Synthesized Regional Blend</div>
              <div className="text-3xl font-black text-blue-950 font-mono mt-1">
                {inspectedBlend.blendedValue} {inspectedBlend.unit}
              </div>
              <div className="text-[11px] text-blue-700 mt-1">
                Uncertainty Spread: [{inspectedBlend.uncertaintyRange.lower} – {inspectedBlend.uncertaintyRange.upper} {inspectedBlend.unit}]
              </div>
            </div>

            {/* Local Weights Breakdown */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Local Dynamic Weights:</span>
                <span className="text-[10px] text-slate-400 font-mono">Normalized 100%</span>
              </div>

              {inspectedBlend.contributions.map((c) => (
                <div key={c.modelId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{c.modelName}</span>
                    <span className="font-mono font-bold text-slate-900">{Math.round(c.adaptiveWeight * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(c.adaptiveWeight * 100)}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <p className="text-[11px] leading-relaxed">
              <strong>Regional Prior:</strong> {inspectedLocation.climateZone}. System boosts models with historically low error variance over this specific orography.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
