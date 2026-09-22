import React, { useState } from 'react';
import { 
  GeoLocation, 
  WeatherRegime, 
  ExtremeRiskItem 
} from '../../types/weather';
import { 
  DEFAULT_THRESHOLDS, 
  UserAlertThresholds, 
  evaluateExtremeRisks 
} from '../../engine/extremeWeatherEngine';
import { 
  AlertOctagon, 
  CloudRain, 
  Flame, 
  Wind, 
  AlertTriangle, 
  ShieldAlert, 
  BellRing, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { RiskLevelBadge } from '../common/Badges';

interface ExtremeWeatherViewProps {
  location: GeoLocation;
  regime: WeatherRegime;
}

export function ExtremeWeatherView({ location, regime }: ExtremeWeatherViewProps) {
  const [thresholds, setThresholds] = useState<UserAlertThresholds>(DEFAULT_THRESHOLDS);
  const [showThresholdModal, setShowThresholdModal] = useState(false);

  const risks = evaluateExtremeRisks(location, regime, thresholds);
  const activeAlerts = risks.filter(r => r.riskLevel === 'severe' || r.riskLevel === 'high');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Heavy Rainfall': return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'Heat Wave': return <Flame className="w-5 h-5 text-amber-600" />;
      case 'High Wind': return <Wind className="w-5 h-5 text-teal-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Alert Threshold Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-bold text-xs uppercase shadow-xs">
                Hazard Early Warning
              </span>
              <span className="text-xs text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 font-semibold">
                {activeAlerts.length} Active Hazard Advisories
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Extreme Weather Intelligence & Early Detection
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Probabilistic threshold exceedance engine combining multi-model ensemble dispersion and regime physics for {location.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowThresholdModal(!showThresholdModal)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Configure Thresholds</span>
            </button>
          </div>
        </div>

        {/* Threshold configuration drawer */}
        {showThresholdModal && (
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Custom Alert Trigger Thresholds</span>
              <button
                type="button"
                onClick={() => setThresholds(DEFAULT_THRESHOLDS)}
                className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rain */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-700">Rainfall Triggers (mm/24h)</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Warning:</span>
                  <input
                    type="number"
                    value={thresholds.rainfallWarningMm}
                    onChange={(e) => setThresholds({ ...thresholds, rainfallWarningMm: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Severe:</span>
                  <input
                    type="number"
                    value={thresholds.rainfallSevereMm}
                    onChange={(e) => setThresholds({ ...thresholds, rainfallSevereMm: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
              </div>

              {/* Temp */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-700">Temperature Triggers (°C)</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Warning:</span>
                  <input
                    type="number"
                    value={thresholds.tempWarningC}
                    onChange={(e) => setThresholds({ ...thresholds, tempWarningC: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Severe:</span>
                  <input
                    type="number"
                    value={thresholds.tempSevereC}
                    onChange={(e) => setThresholds({ ...thresholds, tempSevereC: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
              </div>

              {/* Wind */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-700">Wind Triggers (km/h)</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Warning:</span>
                  <input
                    type="number"
                    value={thresholds.windWarningKmh}
                    onChange={(e) => setThresholds({ ...thresholds, windWarningKmh: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Severe:</span>
                  <input
                    type="number"
                    value={thresholds.windSevereKmh}
                    onChange={(e) => setThresholds({ ...thresholds, windSevereKmh: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded text-right font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extreme Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {risks.map((risk) => {
          const isSevere = risk.riskLevel === 'severe';
          const isHigh = risk.riskLevel === 'high';

          return (
            <div
              key={risk.id}
              className={`glass-panel rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isSevere ? 'border-red-300 bg-red-50/20 shadow-md ring-1 ring-red-200' :
                isHigh ? 'border-amber-300 bg-amber-50/20' :
                'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getCategoryIcon(risk.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{risk.category}</h3>
                      <p className="text-[11px] text-slate-400">Peak Window: {risk.peakLeadTime}</p>
                    </div>
                  </div>
                  <RiskLevelBadge level={risk.riskLevel} />
                </div>

                {/* Probability Meter */}
                <div className="space-y-1.5 my-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Exceedance Probability:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{risk.probability}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isSevere ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${risk.probability}%` }}
                    />
                  </div>
                </div>

                {/* Key Meteorological Stats */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expected Blended Peak:</span>
                    <span className="font-bold text-slate-900 font-mono">{risk.expectedValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-medium text-slate-700">{risk.expectedDuration}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    {risk.anomalyText}
                  </div>
                </div>

                {/* Operational Advisory */}
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  isSevere ? 'bg-red-100/70 border border-red-200 text-red-900' :
                  isHigh ? 'bg-amber-100/70 border border-amber-200 text-amber-900' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <p className="text-[11px] font-medium">{risk.advisory}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Ensemble Confidence:</span>
                <span className="font-semibold text-emerald-700">92% Reliable</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimers & Operational Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Synthetic Research Simulation Environment</span>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            All alert thresholds and exceedance probabilities are generated via the client-side scientific demo blending pipeline. Never use simulated academic models as official civil defense emergency evacuation orders.
          </p>
        </div>
      </div>

    </div>
  );
}
