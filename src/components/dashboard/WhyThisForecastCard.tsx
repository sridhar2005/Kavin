import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, BarChart2, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { BlendedForecastResult } from '../../types/weather';
import { AgreementBadge, ConfidenceBadge } from '../common/Badges';

interface WhyThisForecastCardProps {
  blendResult: BlendedForecastResult;
}

export function WhyThisForecastCard({ blendResult }: WhyThisForecastCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { explainability, confidencePercent, confidenceLevel, agreementLevel, agreementScore, detectedRegime } = blendResult;

  const factors = [
    { label: 'Historical Skill', weight: explainability.historicalSkillWeight, color: 'bg-[#1e40af]', desc: '3-year WMO verification score' },
    { label: 'Model Agreement', weight: explainability.modelAgreementWeight, color: 'bg-emerald-600', desc: 'Inter-model variance convergence' },
    { label: 'Regime Match', weight: explainability.weatherRegimeWeight, color: 'bg-[#0284c7]', desc: `Specialized ${detectedRegime} skill` },
    { label: 'Lead Horizon', weight: explainability.leadTimeDecayWeight, color: 'bg-amber-500', desc: 'Short-range vs ensemble decay' },
    { label: 'Regional Prior', weight: explainability.regionalPerformanceWeight, color: 'bg-purple-600', desc: 'Local topography tuning' },
  ];

  return (
    <div className="stitch-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1e40af] flex items-center justify-center border border-blue-100">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Explainability Attribution
              </h3>
              <p className="text-[11px] text-slate-400">Deterministic decomposition of weights</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ConfidenceBadge percent={confidencePercent} level={confidenceLevel} />
            <AgreementBadge level={agreementLevel} score={agreementScore} />
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-800">
            {explainability.summaryText}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {blendResult.confidenceReason}
          </p>
        </div>

        {/* Toggle Factor Breakdown */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#1e40af] hover:underline flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide Factor Breakdown' : 'View Contributing Factors (35% Skill, 25% Agreement...)'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] text-slate-400 font-mono">Σ = 100%</span>
        </div>

        {/* Expanded Breakdown */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {factors.map((f) => (
                <div key={f.label} className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700 text-[11px]">{f.label}</span>
                    <span className="font-mono font-bold text-slate-900">{f.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.weight * 2}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Dominant Driver: <strong>{explainability.keyDrivingFactor}</strong></span>
        <span className="font-mono text-slate-400">Traceable ML</span>
      </div>
    </div>
  );
}
