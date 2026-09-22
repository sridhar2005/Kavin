import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ForecastVariable, GeoLocation, LeadTimeHours, WeatherRegime } from '../../types/weather';
import { computeTimeSeriesForecast } from '../../engine/blendingEngine';
import { Sparkles, Layers, Sliders } from 'lucide-react';

interface MainBlendChartProps {
  location: GeoLocation;
  currentLeadTime: LeadTimeHours;
  regime: WeatherRegime;
}

export function MainBlendChart({
  location,
  currentLeadTime,
  regime
}: MainBlendChartProps) {
  const [selectedVariable, setSelectedVariable] = useState<ForecastVariable>('rainfall');
  const [showModels, setShowModels] = useState({
    ai: true,
    nwpA: true,
    nwpB: true,
    ensemble: true,
    uncertainty: true
  });

  const seriesData = computeTimeSeriesForecast(location, selectedVariable, regime);

  const unit = 
    selectedVariable === 'rainfall' ? 'mm' :
    selectedVariable === 'temperature' ? '°C' : 'km/h';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2 max-w-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-semibold text-slate-800">
          <span>Forecast Horizon: {data.timeLabel}</span>
          <span className="text-[#1e40af] bg-blue-50 px-1.5 py-0.5 rounded text-[10px] tabular-nums font-bold">
            {data.confidence}% Conf.
          </span>
        </div>

        {/* Hybrid Blend Value */}
        <div className="flex items-center justify-between font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1e40af]"></span>
            <span>Hybrid Blend:</span>
          </div>
          <span className="text-sm font-mono tabular-nums">{data.hybrid} {unit}</span>
        </div>

        {/* Uncertainty Range */}
        <div className="flex items-center justify-between text-slate-500 text-[11px] px-1">
          <span>Uncertainty Range (80% CI):</span>
          <span className="font-mono font-medium text-slate-700 tabular-nums">
            [{data.lowerBound} – {data.upperBound} {unit}]
          </span>
        </div>

        {/* Individual Models */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Model Weights Breakdown:
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> AtmosML (AI):</span>
            <span className="font-mono tabular-nums">{data.ai} {unit} ({data.aiWeight}%)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> EC-IFS (NWP-A):</span>
            <span className="font-mono tabular-nums">{data.nwpA} {unit} ({data.nwpAWeight}%)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> NOAA GFS (NWP-B):</span>
            <span className="font-mono tabular-nums">{data.nwpB} {unit} ({data.nwpBWeight}%)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Multi-EPS:</span>
            <span className="font-mono tabular-nums">{data.ensemble} {unit} ({data.ensWeight}%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="stitch-card p-5 sm:p-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Multi-Model Trajectory & Blended Synthesis
            </h2>
            <span className="stitch-pill bg-blue-50 text-[#1e40af] border-blue-200">
              <Sparkles className="w-3 h-3" /> Adaptive Blend
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Shaded envelope represents dynamic statistical uncertainty bounds. Click layers to toggle model curves.
          </p>
        </div>

        {/* Variable Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedVariable('rainfall')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              selectedVariable === 'rainfall'
                ? 'bg-white text-[#1e40af] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rainfall (mm)
          </button>
          <button
            type="button"
            onClick={() => setSelectedVariable('temperature')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              selectedVariable === 'temperature'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            type="button"
            onClick={() => setSelectedVariable('wind')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              selectedVariable === 'wind'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wind (km/h)
          </button>
        </div>
      </div>

      {/* Model Curve Visibility Toggles */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Layer Visibility:</span>
        <button
          type="button"
          onClick={() => setShowModels(prev => ({ ...prev, uncertainty: !prev.uncertainty }))}
          className={`stitch-pill transition-colors ${
            showModels.uncertainty ? 'bg-blue-50 border-blue-200 text-[#1e40af]' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-sm bg-blue-300 border border-blue-500"></span>
          <span>Confidence Envelope</span>
        </button>

        <button
          type="button"
          onClick={() => setShowModels(prev => ({ ...prev, ai: !prev.ai }))}
          className={`stitch-pill transition-colors ${
            showModels.ai ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>AtmosML AI</span>
        </button>

        <button
          type="button"
          onClick={() => setShowModels(prev => ({ ...prev, nwpA: !prev.nwpA }))}
          className={`stitch-pill transition-colors ${
            showModels.nwpA ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>EC-IFS (NWP-A)</span>
        </button>

        <button
          type="button"
          onClick={() => setShowModels(prev => ({ ...prev, nwpB: !prev.nwpB }))}
          className={`stitch-pill transition-colors ${
            showModels.nwpB ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          <span>NOAA GFS (NWP-B)</span>
        </button>

        <button
          type="button"
          onClick={() => setShowModels(prev => ({ ...prev, ensemble: !prev.ensemble }))}
          className={`stitch-pill transition-colors ${
            showModels.ensemble ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Multi-EPS</span>
        </button>
      </div>

      {/* Recharts Forecast Plot */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={seriesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              unit={` ${unit}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Uncertainty Shaded Area */}
            {showModels.uncertainty && (
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="#0284c7"
                fillOpacity={0.12}
                name="Confidence Envelope"
              />
            )}

            {/* Individual Models */}
            {showModels.ai && (
              <Line
                type="monotone"
                dataKey="ai"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#8b5cf6' }}
                name="AtmosML (AI)"
              />
            )}

            {showModels.nwpA && (
              <Line
                type="monotone"
                dataKey="nwpA"
                stroke="#2563eb"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={{ r: 2.5, fill: '#2563eb' }}
                name="EC-IFS (NWP-A)"
              />
            )}

            {showModels.nwpB && (
              <Line
                type="monotone"
                dataKey="nwpB"
                stroke="#0284c7"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={{ r: 2.5, fill: '#0284c7' }}
                name="NOAA GFS (NWP-B)"
              />
            )}

            {showModels.ensemble && (
              <Line
                type="monotone"
                dataKey="ensemble"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={{ r: 2.5, fill: '#10b981' }}
                name="Multi-EPS"
              />
            )}

            {/* Main Hybrid Blended Line */}
            <Line
              type="monotone"
              dataKey="hybrid"
              stroke="#1e40af"
              strokeWidth={3}
              dot={{ r: 4, fill: '#1e40af', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1e40af' }}
              name="Hybrid Blended Forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Operational Point:</span>
          <span>Lead time T+{currentLeadTime}h</span>
          <span className="text-slate-300">·</span>
          <span>Regime: <strong className="text-slate-700 font-semibold">{regime}</strong></span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {"Forecast_Hybrid(t) = Σ [ w_i(t, regime) · y_i(t) ]"}
        </div>
      </div>
    </div>
  );
}
