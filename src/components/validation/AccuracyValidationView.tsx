import React, { useState } from 'react';
import { 
  HISTORICAL_ACCURACY_DATA, 
  LEAD_TIME_RMSE_TRENDS, 
  RAINFALL_VERIFICATION_SERIES 
} from '../../data/accuracyData';
import { 
  BarChart3, 
  TrendingDown, 
  CheckCircle, 
  Award, 
  ShieldCheck, 
  LineChart as LineChartIcon,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export function AccuracyValidationView() {
  const [metricFilter, setMetricFilter] = useState<'rmse' | 'mae' | 'correlation' | 'skillScore'>('rmse');

  const barChartData = HISTORICAL_ACCURACY_DATA.map(m => ({
    name: m.modelId === 'hybrid' ? 'AuraBlend Hybrid (Ours)' : m.name,
    score: m[metricFilter],
    color: m.color
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-gradient-to-r from-white via-blue-50/20 to-indigo-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-xs uppercase shadow-xs">
                Verification Suite
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                WMO-485 Compliant
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Accuracy & Statistical Validation Dashboard
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Standardized historical verification metrics demonstrating the superiority of adaptive ensemble blending over single deterministic models.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-indigo-200/80 bg-indigo-50/30 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-indigo-900 font-semibold">
            <span>Hybrid Skill Score</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono mt-2">94.2%</div>
          <p className="text-[11px] text-indigo-700 mt-1">+3.7% gain over best single model (AI: 90.5%)</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 shadow-subtle bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Mean Absolute Error (MAE)</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">1.08 mm</div>
          <p className="text-[11px] text-emerald-600 mt-1">-22% error reduction vs raw GFS-FV3</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 shadow-subtle bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Root Mean Square Error</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">1.42</div>
          <p className="text-[11px] text-blue-600 mt-1">Lowest variance under severe extremes</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 shadow-subtle bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pearson Correlation (r)</span>
            <CheckCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">0.94</div>
          <p className="text-[11px] text-slate-500 mt-1">Near-perfect phase alignment with GTS observations</p>
        </div>
      </div>

      {/* Comparative Benchmark Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Individual Model Performance vs AuraBlend Hybrid
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a statistical verification metric to benchmark across models.
            </p>
          </div>

          {/* Metric selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMetricFilter('rmse')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                metricFilter === 'rmse' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RMSE (Lower is better)
            </button>
            <button
              type="button"
              onClick={() => setMetricFilter('mae')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                metricFilter === 'mae' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MAE
            </button>
            <button
              type="button"
              onClick={() => setMetricFilter('correlation')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                metricFilter === 'correlation' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correlation (r)
            </button>
            <button
              type="button"
              onClick={() => setMetricFilter('skillScore')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                metricFilter === 'skillScore' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skill Score %
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-5} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Validation Charts: Observed vs Forecast & Lead-Time RMSE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Observed vs Forecast Backtest Series */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Observed Ground Truth vs Forecast Backtest
            </h3>
            <p className="text-[11px] text-slate-500">
              5-day rolling verification of actual rainfall observations vs model predictions
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RAINFALL_VERIFICATION_SERIES} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" mm" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="observed" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: '#0f172a' }} name="Observed Truth" />
                <Line type="monotone" dataKey="hybrid" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3, fill: '#4f46e5' }} name="Hybrid (Ours)" />
                <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} name="AtmosML AI" />
                <Line type="monotone" dataKey="nwpA" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 2 }} name="EC-IFS NWP-A" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead-Time Error Drift Curve */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Forecast Error (RMSE) Drift vs Lead Time (+6h to +120h)
            </h3>
            <p className="text-[11px] text-slate-500">
              Ensemble blending slows down error growth at extended lead times
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LEAD_TIME_RMSE_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="leadTime" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" RMSE" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="hybrid" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} name="Hybrid Blend (Lowest Error)" />
                <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} name="AtmosML AI" />
                <Line type="monotone" dataKey="nwpA" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 2 }} name="EC-IFS NWP-A" />
                <Line type="monotone" dataKey="ensemble" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="Multi-EPS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Validation Metrics Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white">
        <div className="font-bold text-slate-900 text-sm mb-3">Comprehensive Statistical Benchmark Table</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2">Model Architecture</th>
                <th className="pb-2 text-right">RMSE</th>
                <th className="pb-2 text-right">MAE</th>
                <th className="pb-2 text-right">Mean Bias</th>
                <th className="pb-2 text-right">Pearson Correlation</th>
                <th className="pb-2 text-right">Brier Score</th>
                <th className="pb-2 text-right">Skill Score %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {HISTORICAL_ACCURACY_DATA.map((m) => (
                <tr key={m.modelId} className={m.modelId === 'hybrid' ? 'bg-indigo-50/70 font-bold text-indigo-950' : 'text-slate-700'}>
                  <td className="py-2.5 font-sans flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span>{m.name}</span>
                  </td>
                  <td className="py-2.5 text-right">{m.rmse}</td>
                  <td className="py-2.5 text-right">{m.mae}</td>
                  <td className="py-2.5 text-right">{m.bias > 0 ? `+${m.bias}` : m.bias}</td>
                  <td className="py-2.5 text-right">{m.correlation}</td>
                  <td className="py-2.5 text-right">{m.brierScore}</td>
                  <td className="py-2.5 text-right font-bold text-indigo-700">{m.skillScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
