import React from 'react';
import { 
  GeoLocation, 
  LeadTimeHours, 
  WeatherRegime, 
  BlendedForecastResult,
  ExtremeRiskItem 
} from '../../types/weather';
import { ForecastSummaryCards } from './ForecastSummaryCards';
import { MainBlendChart } from './MainBlendChart';
import { WhyThisForecastCard } from './WhyThisForecastCard';
import { ModelWeightsCard } from './ModelWeightsCard';
import { SystemStatusCard } from './SystemStatusCard';
import { RegimeBadge, ConfidenceBadge, AgreementBadge } from '../common/Badges';
import { 
  ArrowRight, 
  ShieldCheck, 
  Compass,
  Sliders,
  Layers,
  BarChart3
} from 'lucide-react';

interface DashboardViewProps {
  location: GeoLocation;
  leadTime: LeadTimeHours;
  regime: WeatherRegime;
  rainfallBlend: BlendedForecastResult;
  tempBlend: BlendedForecastResult;
  windBlend: BlendedForecastResult;
  extremeRisks: ExtremeRiskItem[];
  onNavigateTab: (tabId: string) => void;
  onSelectVariable: (v: string) => void;
}

export function DashboardView({
  location,
  leadTime,
  regime,
  rainfallBlend,
  tempBlend,
  windBlend,
  extremeRisks,
  onNavigateTab,
  onSelectVariable
}: DashboardViewProps) {
  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Top Banner: Hybrid Forecast Identity & Status */}
      <div className="stitch-card p-5 sm:p-6 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-[#1e40af] text-white font-bold text-[10px] tracking-wider uppercase">
                Hybrid AI–NWP Blend
              </span>
              <RegimeBadge regime={regime} />
              <ConfidenceBadge 
                percent={rainfallBlend.confidencePercent} 
                level={rainfallBlend.confidenceLevel} 
              />
              <AgreementBadge 
                level={rainfallBlend.agreementLevel} 
                score={rainfallBlend.agreementScore} 
              />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-baseline gap-2">
              <span>{location.name}, {location.country}</span>
              <span className="text-xs font-normal text-slate-400 font-sans">
                ({location.climateZone})
              </span>
            </h1>
            
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Synthesized meteorological forecast for <strong>{location.name}</strong> fusing ECMWF IFS (9km), NOAA GFS (13km), Multi-EPS 50-member perturbations, and AtmosML AI surrogate with lead-time calibration.
            </p>
          </div>

          {/* Quick Snapshot Metrics */}
          <div className="flex flex-wrap items-center gap-2 lg:self-end">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <div className="text-[9px] uppercase font-bold text-slate-400">Horizon</div>
              <div className="font-bold text-[#1e40af] font-mono tabular-nums">
                {leadTime === 0 ? 'T+0h (Now)' : `T+${leadTime}h`}
              </div>
            </div>

            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <div className="text-[9px] uppercase font-bold text-slate-400">Status</div>
              <div className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Optimal
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('blending')}
              className="bg-[#1e40af] hover:bg-[#2563eb] text-white px-3 py-2 rounded-lg font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all self-center"
            >
              <span>What-If Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. Main Forecast Summary Cards */}
      <ForecastSummaryCards
        rainfallBlend={rainfallBlend}
        temperatureBlend={tempBlend}
        windBlend={windBlend}
        extremeRisks={extremeRisks}
        onSelectCard={(v) => {
          if (v === 'extreme') onNavigateTab('extreme');
          else {
            onSelectVariable(v);
            onNavigateTab('explorer');
          }
        }}
      />

      {/* 2. Main Forecast Trajectory Chart */}
      <MainBlendChart
        location={location}
        currentLeadTime={leadTime}
        regime={regime}
      />

      {/* 3. Explainability & Dynamic Model Weights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WhyThisForecastCard blendResult={rainfallBlend} />
        <ModelWeightsCard
          contributions={rainfallBlend.contributions}
          regime={regime}
          leadTime={leadTime}
          onOpenStudio={() => onNavigateTab('blending')}
        />
      </div>

      {/* 4. Quick Analytical Navigation Shortcuts */}
      <div className="stitch-card p-5 bg-slate-50/60">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">
          Scientific Intelligence Panes
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab('explorer')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="font-heading font-bold text-slate-800 group-hover:text-[#1e40af] flex items-center justify-between">
              <span>Forecast Explorer</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Multi-variable horizon & raw model curves</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('blending')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="font-heading font-bold text-slate-800 group-hover:text-[#1e40af] flex items-center justify-between">
              <span>What-If Sandbox</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Simulate model dropouts & rebalancing</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('map')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="font-heading font-bold text-slate-800 group-hover:text-[#1e40af] flex items-center justify-between">
              <span>Weight Map</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Geographic model dominance & station nodes</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('validation')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="font-heading font-bold text-slate-800 group-hover:text-[#1e40af] flex items-center justify-between">
              <span>Validation Suite</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">WMO RMSE, MAE & Observed backtests</p>
          </button>
        </div>
      </div>

      {/* 5. Telemetry */}
      <SystemStatusCard />

    </div>
  );
}
