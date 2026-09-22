import React from 'react';
import { CloudSun, Shield, ExternalLink, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-slate-600 text-xs py-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <CloudSun className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm">
                AuraBlend AI — Meteorological Forecast Synthesis
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-lg">
              A hybrid meteorological platform combining Physical Numerical Weather Prediction (ECMWF, NOAA GFS), Multi-Model Ensembles, and AI/ML Deep Atmospheric Surrogates with continuous dynamic weighting, weather regime classification, and statistical uncertainty estimation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200 inline-flex">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Simulated research benchmark environment — All model streams normalized via $\sum w_i = 1.0$.</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Models Integrated</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> AtmosML Neural-Graph (AI/ML)</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600"></span> ECMWF IFS High-Res 9km (NWP-A)</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> NOAA GFS-FV3 Spectral (NWP-B)</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Global Multi-EPS 50-Member</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Standards & Research</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>WMO-No. 485 Verification Guide</li>
              <li>Continuous Ranked Probability Score</li>
              <li>Brier Probability Skill Metrics</li>
              <li>ISO-19115 Geographic Metadata</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} AuraBlend Hybrid AI-NWP System. Clean Scientific Intelligence Architecture.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              <Cpu className="w-3 h-3 text-indigo-500" />
              Dynamic Auto-Rebalancing Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
