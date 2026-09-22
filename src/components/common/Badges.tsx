import React from 'react';
import { ShieldCheck, AlertTriangle, CloudRain, Sun, Wind, Activity, CheckCircle2 } from 'lucide-react';
import { AgreementLevel, RiskLevel, WeatherRegime } from '../../types/weather';

export function UncertaintyBadge({
  value,
  unit,
  lower,
  upper,
  className = ''
}: {
  value: number;
  unit: string;
  lower: number;
  upper: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium tabular-nums ${className}`}>
      <span className="font-bold text-slate-900">{value} {unit}</span>
      <span className="text-slate-400 font-mono text-[11px]">[{lower} – {upper} {unit}]</span>
    </div>
  );
}

export function ConfidenceBadge({
  percent,
  level
}: {
  percent: number;
  level: 'High Confidence' | 'Moderate Confidence' | 'Low Confidence';
}) {
  const isHigh = percent >= 80;
  const isMed = percent >= 60 && percent < 80;

  return (
    <div className={`stitch-pill ${
      isHigh ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' :
      isMed ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]' :
      'bg-[#ffe4e6] text-[#9f1239] border-[#fecdd3]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isHigh ? 'bg-[#16a34a]' : isMed ? 'bg-[#d97706]' : 'bg-[#e11d48] animate-pulse'
      }`} />
      <span className="tabular-nums font-bold">{percent}%</span>
      <span className="text-[10px] opacity-80 uppercase tracking-wider">{level.replace(' Confidence', '')}</span>
    </div>
  );
}

export function AgreementBadge({
  level,
  score
}: {
  level: AgreementLevel;
  score: number;
}) {
  if (level === 'strong') {
    return (
      <span className="stitch-pill bg-emerald-50 text-emerald-800 border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="tabular-nums">Agreement: {score}%</span>
      </span>
    );
  }
  if (level === 'moderate') {
    return (
      <span className="stitch-pill bg-amber-50 text-amber-800 border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span className="tabular-nums">Moderate Spread ({score}%)</span>
      </span>
    );
  }
  return (
    <span className="stitch-pill bg-rose-50 text-rose-800 border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
      <span className="tabular-nums">Discrepancy ({score}%)</span>
    </span>
  );
}

export function RegimeBadge({ regime }: { regime: WeatherRegime }) {
  const getIcon = () => {
    switch (regime) {
      case 'Heavy Rainfall':
      case 'Monsoon':
        return <CloudRain className="w-3.5 h-3.5 text-blue-600" />;
      case 'Heat-Wave':
        return <Sun className="w-3.5 h-3.5 text-amber-600" />;
      case 'High-Wind / Gale':
        return <Wind className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="stitch-pill bg-slate-100 text-slate-800 border-slate-200 shadow-2xs">
      {getIcon()}
      <span>Regime: <strong className="text-slate-900 font-semibold">{regime}</strong></span>
    </div>
  );
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  switch (level) {
    case 'severe':
      return (
        <span className="stitch-pill bg-rose-100 text-rose-800 border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" /> Severe
        </span>
      );
    case 'high':
      return (
        <span className="stitch-pill bg-amber-100 text-amber-800 border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Warning
        </span>
      );
    case 'moderate':
      return (
        <span className="stitch-pill bg-yellow-50 text-yellow-800 border-yellow-200">
          Watch
        </span>
      );
    case 'low':
    default:
      return (
        <span className="stitch-pill bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Nominal
        </span>
      );
  }
}
