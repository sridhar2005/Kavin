import React from 'react';
import { Sliders, Cpu, ArrowRight } from 'lucide-react';
import { ModelContribution, WeatherRegime } from '../../types/weather';

interface ModelWeightsCardProps {
  contributions: ModelContribution[];
  regime: WeatherRegime;
  leadTime: number;
  onOpenStudio?: () => void;
}

export function ModelWeightsCard({
  contributions,
  regime,
  leadTime,
  onOpenStudio
}: ModelWeightsCardProps) {
  const sorted = [...contributions].sort((a, b) => b.adaptiveWeight - a.adaptiveWeight);

  return (
    <div className="stitch-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1e40af] flex items-center justify-center border border-blue-100">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-xs tracking-tight">
                Model Allocation Weights
              </h3>
              <p className="text-[11px] text-slate-400">Dynamic normalization at +{leadTime}h horizon</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenStudio}
            className="text-xs font-semibold text-[#1e40af] hover:underline flex items-center gap-1"
          >
            <span>What-If Sandbox</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Dynamic Weight Progress Bars */}
        <div className="space-y-3 my-2">
          {sorted.map((item) => {
            const weightPercent = Math.round(item.adaptiveWeight * 100);
            return (
              <div key={item.modelId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-semibold text-slate-800">{item.modelName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.type.split(' ')[0]})</span>
                    {!item.isOnline && (
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                        OFFLINE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px] tabular-nums">Skill: {item.historicalSkill}%</span>
                    <span className="font-bold text-slate-900 text-xs tabular-nums">
                      {item.isOnline ? `${weightPercent}%` : '0%'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: item.isOnline ? `${weightPercent}%` : '0%',
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#1e40af]" />
          <span>Condition: <strong>{regime}</strong></span>
        </div>
        <span className="font-mono font-bold text-slate-800 tabular-nums">Total: 100.0%</span>
      </div>
    </div>
  );
}
