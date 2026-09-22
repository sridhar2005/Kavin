import React, { useState } from 'react';
import { 
  ForecastVariable, 
  GeoLocation, 
  LeadTimeHours, 
  WeatherRegime,
  ModelContribution
} from '../../types/weather';
import { computeHybridForecast, computeTimeSeriesForecast } from '../../engine/blendingEngine';
import { 
  CloudRain, 
  Thermometer, 
  Wind, 
  AlertTriangle, 
  Sun, 
  Flame,
  CheckCircle2,
  Info,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ConfidenceBadge, AgreementBadge, RegimeBadge } from '../common/Badges';

interface ForecastExplorerViewProps {
  location: GeoLocation;
  currentLeadTime: LeadTimeHours;
  onChangeLeadTime: (lt: LeadTimeHours) => void;
  regime: WeatherRegime;
  defaultVariable?: ForecastVariable;
}

export function ForecastExplorerView({
  location,
  currentLeadTime,
  onChangeLeadTime,
  regime,
  defaultVariable = 'rainfall'
}: ForecastExplorerViewProps) {
  const [selectedVariable, setSelectedVariable] = useState<ForecastVariable>(defaultVariable);

  const blendResult = computeHybridForecast({
    location,
    leadTime: currentLeadTime,
    variable: selectedVariable,
    scenarioRegime: regime
  });

  const seriesData = computeTimeSeriesForecast(location, selectedVariable, regime);

  const variables: { id: ForecastVariable; label: string; icon: any; unit: string; desc: string }[] = [
    { id: 'rainfall', label: 'Rainfall Accumulation', icon: CloudRain, unit: 'mm', desc: 'Precipitation depth integrated over lead time' },
    { id: 'temperature', label: 'Surface Temperature', icon: Thermometer, unit: '°C', desc: '2-meter atmospheric surface dry bulb temperature' },
    { id: 'wind', label: 'Wind Speed & Gusts', icon: Wind, unit: 'km/h', desc: '10-meter vector mean with peak aerodynamic gusts' },
    { id: 'extreme_rain', label: 'Extreme Rain Probability', icon: AlertTriangle, unit: '%', desc: 'Exceedance probability for >50 mm/24h hazard' },
    { id: 'heat_wave', label: 'Heat-Wave Index', icon: Flame, unit: '%', desc: 'Thermal stress probability based on 850hPa anomaly' },
    { id: 'high_wind', label: 'Gale-Wind Threat', icon: Sun, unit: '%', desc: 'Probability of sustained winds >55 km/h' },
  ];

  const currentVarConfig = variables.find(v => v.id === selectedVariable)!;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase">
                Forecast Explorer
              </span>
              <RegimeBadge regime={regime} />
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Multi-Variable Multi-Model Synthesis
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare individual raw model outputs with the dynamic blended trajectory for {location.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ConfidenceBadge percent={blendResult.confidencePercent} level={blendResult.confidenceLevel} />
            <AgreementBadge level={blendResult.agreementLevel} score={blendResult.agreementScore} />
          </div>
        </div>

        {/* Variable Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-100">
          {variables.map((v) => {
            const Icon = v.icon;
            const isSelected = selectedVariable === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariable(v.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20 ring-2 ring-blue-600/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <span className={`text-[10px] font-bold font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {v.unit}
                  </span>
                </div>
                <div className="font-bold text-xs leading-tight line-clamp-1">{v.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus: Blended Output Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Blended Metric Highlight */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/40">
          <div>
            <div className="flex items-center justify-between text-xs text-indigo-900 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Hybrid Synthesized Output
              </span>
              <span className="bg-indigo-100/80 px-2 py-0.5 rounded text-indigo-800 text-[11px] font-mono">
                T+{currentLeadTime}h
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight">
                {blendResult.blendedValue}
              </span>
              <span className="text-lg font-bold text-indigo-700">
                {blendResult.unit}
              </span>
            </div>

            <div className="mt-3 p-3 bg-white/80 rounded-xl border border-indigo-100/80 text-xs space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Statistical Uncertainty Range:</span>
                <span className="font-bold text-indigo-900 font-mono">
                  [{blendResult.uncertaintyRange.lower} – {blendResult.uncertaintyRange.upper} {blendResult.unit}]
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Confidence Level:</span>
                <span className="font-semibold text-emerald-700">{blendResult.confidencePercent}% ({blendResult.confidenceLevel})</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100/60 text-xs text-slate-600 leading-relaxed">
            <p className="text-[11px]">
              {blendResult.explainability.summaryText}
            </p>
          </div>
        </div>

        {/* Dynamic Model Contributions List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Individual Model Contributions & Weighting</h3>
              <p className="text-[11px] text-slate-500">Decomposition of input models at +{currentLeadTime}h lead time</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Normalized $\Sigma w_i = 100\%$
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-semibold">Model Source</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold text-right">Raw Prediction</th>
                  <th className="pb-2 font-semibold text-right">Skill Score</th>
                  <th className="pb-2 font-semibold text-right">Dynamic Weight</th>
                  <th className="pb-2 font-semibold text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blendResult.contributions.map((item) => (
                  <tr key={item.modelId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.modelName}</span>
                    </td>
                    <td className="py-2.5 text-slate-500 text-[11px]">{item.type}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-800">
                      {item.predictedValue} {blendResult.unit}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-600">
                      {item.historicalSkill}%
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-indigo-700">
                      {Math.round(item.adaptiveWeight * 100)}%
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900 bg-indigo-50/40 rounded px-2">
                      +{item.finalContribution} {blendResult.unit}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-50 text-slate-900 border-t-2 border-slate-200">
                  <td className="py-2.5 px-2">Hybrid Blended Forecast</td>
                  <td className="py-2.5 text-slate-500 text-[11px]">Ensemble Synthesis</td>
                  <td className="py-2.5 text-right font-mono text-indigo-900 text-sm" colSpan={3}>
                    {"Weighted Sum Σ (w_i · y_i)"}
                  </td>
                  <td className="py-2.5 text-right font-mono text-indigo-900 text-sm px-2">
                    {blendResult.blendedValue} {blendResult.unit}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Trajectory Plot for Current Variable */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentVarConfig.label} ({currentVarConfig.unit}) — 0 to 120h Lead-Time Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentVarConfig.desc}</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={seriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit={` ${currentVarConfig.unit}`} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="#818cf8"
                fillOpacity={0.15}
                name="Confidence Envelope"
              />
              <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} name="AtmosML AI" />
              <Line type="monotone" dataKey="nwpA" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 2 }} name="EC-IFS NWP-A" />
              <Line type="monotone" dataKey="nwpB" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="NOAA GFS NWP-B" />
              <Line type="monotone" dataKey="ensemble" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 2 }} name="Multi-EPS" />
              <Line type="monotone" dataKey="hybrid" stroke="#4338ca" strokeWidth={3} dot={{ r: 4, fill: '#4338ca' }} name="Hybrid Blend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
