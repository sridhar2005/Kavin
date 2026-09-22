import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  Activity, 
  ShieldCheck, 
  Zap, 
  FileCode, 
  ChevronDown, 
  ChevronUp, 
  Server,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { SYSTEM_FEEDS_STATUS } from '../../data/systemHealth';

export function MethodologyView() {
  const [showAdvancedMath, setShowAdvancedMath] = useState(false);

  const pipelineSteps = [
    { step: 1, title: 'Multi-Source Ingestion', desc: 'Ingest ECMWF IFS GRIB2, NOAA GFS NOMADS, Multi-EPS ensemble members, and AtmosML AI surrogate predictions.', icon: Database },
    { step: 2, title: 'Data Quality & Anomaly QA', desc: 'Real-time GTS sanity validation, outlier clipping, grid interpolation to standard 0.1° resolution.', icon: ShieldCheck },
    { step: 3, title: 'Feature Processing', desc: 'Spatial bilinear regridding, thermodynamic lapse-rate height adjustments, boundary layer moisture conversions.', icon: Layers },
    { step: 4, title: 'Atmospheric Regime Detection', desc: 'Evaluate CAPE, precipitable water, baroclinic front proximity, and 850 hPa thermal anomalies to classify active weather regime.', icon: Zap },
    { step: 5, title: 'Historical Skill Evaluation', desc: 'Look up 3-year verified rolling WMO skill scores, RMSE priors, and regional bias profiles for the active geography.', icon: Activity },
    { step: 6, title: 'Adaptive Dynamic Weighting', desc: 'Calculate raw weights via Skill × Lead-Time Decay × Regime Multiplier × Feed Availability and normalize to sum to 100%.', icon: Cpu },
    { step: 7, title: 'Ensemble Hybrid Synthesis', desc: 'Execute weighted combination Y = Σ (w_i * y_i) across rainfall, temperature, and wind vector fields.', icon: SparklesIcon },
    { step: 8, title: 'Uncertainty & Spread Bounds', desc: 'Compute inter-model standard deviation with lead-time expansion factors to generate 80% and 95% confidence bounds.', icon: ShieldCheck },
    { step: 9, title: 'Hazard Exceedance Analysis', desc: 'Evaluate probabilistic thresholds for extreme rainfall (>50mm), heatwaves (>38°C), and gale winds (>55 km/h).', icon: Activity },
    { step: 10, title: 'Explainability & Delivery API', desc: 'Deconstruct final prediction into human-readable attribution narratives and deliver via REST API.', icon: FileCode },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-gradient-to-r from-white via-indigo-50/20 to-blue-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs uppercase shadow-xs">
                System Architecture
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                End-to-End Pipeline
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Methodology, Pipeline & Mathematical Formulation
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Transparent, scientifically rigorous meteorological fusion framework. No black-box estimations—every weight is deterministically traceable.
            </p>
          </div>
        </div>
      </div>

      {/* 10-Step Interactive Pipeline Flowchart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="mb-5 pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>Automated 10-Stage Forecast Blending Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential workflow executing every forecast cycle to ingest, evaluate, blend, and verify weather predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {s.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="font-bold text-xs text-slate-900 leading-tight mb-1">{s.title}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Mathematical Blending Formulations</h3>
            <p className="text-xs text-slate-500">Core analytical equations governing multi-model ensemble synthesis</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedMath(!showAdvancedMath)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>{showAdvancedMath ? 'Collapse Formulas' : 'Expand Advanced Math'}</span>
            {showAdvancedMath ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Formula 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">1. Adaptive Dynamic Weight</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-indigo-950 my-2 overflow-x-auto">
              w_i(t, R) = (S_i · L_i(t) · R_i · Q_i) / Σ (S_k · L_k(t) · R_k · Q_k)
            </div>
            <p className="text-[11px] text-slate-500">
              Guarantees weights sum to unity ($\sum w_i = 1.0$) and adapt to lead-time $t$, regime $R$, and feed status $Q_i$.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">2. Hybrid Synthesized Blend</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-indigo-950 my-2 overflow-x-auto">
              Y_hybrid(t) = Σ [ w_i(t, R) · y_i(t) ]
            </div>
            <p className="text-[11px] text-slate-500">
              Convex linear combination minimizing total variance while eliminating single-model deterministic bias.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">3. Statistical Uncertainty Bounds</div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-indigo-950 my-2 overflow-x-auto">
              CI_80% = Y_hybrid ± 1.28 · σ_adj · (1 + t / 48)
            </div>
            <p className="text-[11px] text-slate-500">
              Expands uncertainty envelope dynamically as models diverge or forecast horizon increases.
            </p>
          </div>

        </div>

        {showAdvancedMath && (
          <div className="mt-4 pt-4 border-t border-slate-100 p-4 rounded-xl bg-indigo-50/40 text-xs space-y-2 animate-fadeIn">
            <p className="text-slate-600 leading-relaxed">
              Model error variance is estimated via rolling expanding-window evaluation:
              <br />
              <code className="font-mono text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                {"Var(e_i) = (1/M) * Σ (y_pred_i,m - y_obs,m)^2"}
              </code>
              <br />
              During regime transitions, the regime multiplier R_i(regime) is dynamically weighted via a Bayesian posterior update against climatological ground stations.
            </p>
          </div>
        )}
      </div>

      {/* Data Quality Feeds Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Data Quality & Telemetry Assurance</h3>
            <p className="text-[11px] text-slate-500">Continuous monitoring of upstream model availability and GTS observation latency</p>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
            All Pipelines Optimal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2">Data Feed Name</th>
                <th className="pb-2">Source / Protocol</th>
                <th className="pb-2">Latency</th>
                <th className="pb-2">Missing Rate</th>
                <th className="pb-2">Last Synchronized</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {SYSTEM_FEEDS_STATUS.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-slate-900">{f.name}</td>
                  <td className="py-2.5 font-sans text-slate-500 text-[11px]">{f.source}</td>
                  <td className="py-2.5 text-slate-700">{f.latency}</td>
                  <td className="py-2.5 text-slate-700">{f.missingRate}</td>
                  <td className="py-2.5 text-slate-500 text-[11px]">{f.lastSync}</td>
                  <td className="py-2.5 text-right font-sans">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function SparklesIcon(props: any) {
  return <Zap {...props} />;
}
