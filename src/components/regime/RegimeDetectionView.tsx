import React, { useState } from 'react';
import { 
  GeoLocation, 
  WeatherRegime, 
  LeadTimeHours 
} from '../../types/weather';
import { getRegimeProfile } from '../../engine/regimeDetector';
import { computeHybridForecast } from '../../engine/blendingEngine';
import { 
  Sparkles, 
  CloudRain, 
  Sun, 
  Wind, 
  Zap, 
  ThermometerSun, 
  CloudLightning, 
  Layers,
  ArrowRight,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface RegimeDetectionViewProps {
  location: GeoLocation;
  leadTime: LeadTimeHours;
  currentRegime: WeatherRegime;
}

const REGIMES: { id: WeatherRegime; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'Monsoon', label: 'Monsoon Circulation', icon: CloudRain, color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Sustained moisture trough with continuous low-level jet flow' },
  { id: 'Heavy Rainfall', label: 'Heavy Convective Storm', icon: CloudLightning, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', desc: 'Severe deep convective moisture convergence (>50mm)' },
  { id: 'Heat-Wave', label: 'Heat-Wave Ridge', icon: Sun, color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Upper-tropospheric anticyclonic ridge and thermal inversion' },
  { id: 'High-Wind / Gale', label: 'Gale & Cyclonic Wind', icon: Wind, color: 'text-teal-600 bg-teal-50 border-teal-200', desc: 'Tight isobaric gradient and marine pressure depression' },
  { id: 'Convective', label: 'Convective Instability', icon: Zap, color: 'text-purple-600 bg-purple-50 border-purple-200', desc: 'High CAPE (>2000 J/kg) with rapid localized updrafts' },
  { id: 'Dry / Stable', label: 'Dry Anticyclone', icon: ThermometerSun, color: 'text-slate-600 bg-slate-50 border-slate-200', desc: 'Subtropical subsidence capping inversion with dry skies' },
  { id: 'Transitional', label: 'Frontal Transition', icon: Layers, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', desc: 'Migrating baroclinic zone between air masses' },
  { id: 'Normal', label: 'Normal Synoptic', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Equilibrium atmospheric baseline state' },
];

export function RegimeDetectionView({
  location,
  leadTime,
  currentRegime
}: RegimeDetectionViewProps) {
  const [selectedRegime, setSelectedRegime] = useState<WeatherRegime>(currentRegime);

  const profile = getRegimeProfile(selectedRegime, location);
  
  const blendResult = computeHybridForecast({
    location,
    leadTime,
    variable: 'rainfall',
    scenarioRegime: selectedRegime
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-gradient-to-r from-white via-indigo-50/20 to-blue-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs uppercase shadow-xs">
                Atmospheric Classification
              </span>
              <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-semibold">
                Detected: {currentRegime}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Intelligent Weather Regime Detection
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              The AI classifier automatically detects the synoptic weather regime and boosts models with verified historical skill under those exact atmospheric dynamics.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Regime Selector Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REGIMES.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRegime === r.id;
          const isDetected = currentRegime === r.id;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRegime(r.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {isDetected && (
                <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  Live Detected
                </span>
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                isSelected ? 'bg-white/20 text-white' : r.color
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs">{r.label}</div>
              <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {r.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Regime Profile & Dynamic Weight Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Regime Diagnostic Profile */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Atmospheric State</div>
              <h3 className="font-bold text-slate-900 text-base">{profile.regime}</h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {profile.confidence}% Confidence
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {profile.description}
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800">Primary Atmospheric Drivers:</div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {profile.primaryDrivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Model Adaptation during this Regime */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Model Weight Calibration Under {selectedRegime}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dynamic multiplier shifts based on historical domain skill for {location.name}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                $\sum = 100\%$
              </span>
            </div>

            <div className="space-y-4">
              {blendResult.contributions.map((c) => {
                const isDominant = c.modelId === blendResult.explainability.dominantModel;
                return (
                  <div key={c.modelId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="font-semibold text-slate-800">{c.modelName}</span>
                        {isDominant && (
                          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                            REGIME SPECIALIST
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400 text-[11px]">Multiplier: {c.regimeMultiplier}x</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {Math.round(c.adaptiveWeight * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(c.adaptiveWeight * 100)}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              "The blending system has increased the contribution of models that historically perform better during {selectedRegime} conditions (EC-IFS boundary layer moist physics / AtmosML thermal gradient resolution)."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
