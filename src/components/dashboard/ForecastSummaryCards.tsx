import React from 'react';
import { CloudRain, Thermometer, Wind, AlertTriangle, ArrowUpRight, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { BlendedForecastResult, ExtremeRiskItem } from '../../types/weather';
import { RiskLevelBadge } from '../common/Badges';

interface ForecastSummaryCardsProps {
  rainfallBlend: BlendedForecastResult;
  temperatureBlend: BlendedForecastResult;
  windBlend: BlendedForecastResult;
  extremeRisks: ExtremeRiskItem[];
  onSelectCard?: (variable: string) => void;
}

export function ForecastSummaryCards({
  rainfallBlend,
  temperatureBlend,
  windBlend,
  extremeRisks,
  onSelectCard
}: ForecastSummaryCardsProps) {
  const highestRisk = extremeRisks.find(r => r.riskLevel === 'severe') || 
                      extremeRisks.find(r => r.riskLevel === 'high') || 
                      extremeRisks[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Rainfall Card */}
      <div 
        onClick={() => onSelectCard?.('rainfall')}
        className="stitch-card p-5 cursor-pointer group flex flex-col justify-between"
      >
        <div>
          {/* 44px Clean Card Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1e40af] flex items-center justify-center border border-blue-100 group-hover:bg-[#1e40af] group-hover:text-white transition-colors">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Rainfall
              </span>
            </div>
            <span className="stitch-pill bg-slate-50 text-slate-600 border-slate-200">
              {rainfallBlend.timeLabel}
            </span>
          </div>

          {/* Metric Value */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {rainfallBlend.blendedValue}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase">mm</span>
          </div>

          {/* Uncertainty Range */}
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Uncertainty:</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] tabular-nums bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {rainfallBlend.uncertaintyRange.lower} – {rainfallBlend.uncertaintyRange.upper} mm
            </span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Model Agreement:</span>
          <span className="font-bold text-emerald-700 tabular-nums">{rainfallBlend.agreementScore}%</span>
        </div>
      </div>

      {/* 2. Temperature Card */}
      <div 
        onClick={() => onSelectCard?.('temperature')}
        className="stitch-card p-5 cursor-pointer group flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Thermometer className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Temperature
              </span>
            </div>
            <span className="stitch-pill bg-slate-50 text-slate-600 border-slate-200">
              {temperatureBlend.timeLabel}
            </span>
          </div>

          {/* Metric Value */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {temperatureBlend.blendedValue}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase">°C</span>
            <span className="text-[11px] text-slate-400 ml-1 tabular-nums">
              ({((temperatureBlend.blendedValue * 9/5) + 32).toFixed(1)}°F)
            </span>
          </div>

          {/* Spread Range */}
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Spread Interval:</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] tabular-nums bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {temperatureBlend.uncertaintyRange.lower}° – {temperatureBlend.uncertaintyRange.upper}°C
            </span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Confidence:</span>
          <span className="font-bold text-[#1e40af] tabular-nums">{temperatureBlend.confidencePercent}%</span>
        </div>
      </div>

      {/* 3. Wind Speed Card */}
      <div 
        onClick={() => onSelectCard?.('wind')}
        className="stitch-card p-5 cursor-pointer group flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Wind Speed
              </span>
            </div>
            <span className="stitch-pill bg-slate-50 text-slate-600 border-slate-200">
              {windBlend.timeLabel}
            </span>
          </div>

          {/* Metric Value */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {windBlend.blendedValue}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase">km/h</span>
            <span className="text-[11px] text-slate-400 ml-1 tabular-nums">
              ({(windBlend.blendedValue / 3.6).toFixed(1)} m/s)
            </span>
          </div>

          {/* Gust Window */}
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Gust Potential:</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] tabular-nums bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Up to {(windBlend.blendedValue * 1.35).toFixed(0)} km/h
            </span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Vector Agreement:</span>
          <span className="font-bold text-emerald-700 tabular-nums">{windBlend.agreementScore}%</span>
        </div>
      </div>

      {/* 4. Extreme Risk Card */}
      <div 
        onClick={() => onSelectCard?.('extreme')}
        className="stitch-card p-5 cursor-pointer group flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                highestRisk.riskLevel === 'severe' ? 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white' :
                highestRisk.riskLevel === 'high' ? 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white' :
                'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Hazard Index
              </span>
            </div>
            <RiskLevelBadge level={highestRisk.riskLevel} />
          </div>

          <div className="mt-1">
            <div className="font-heading font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>{highestRisk.category}</span>
              <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">{highestRisk.probability}% prob.</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {highestRisk.expectedValue} · {highestRisk.anomalyText}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Peak Horizon:</span>
          <span className="font-semibold text-slate-800">{highestRisk.peakLeadTime}</span>
        </div>
      </div>

    </div>
  );
}
