import React from 'react';
import { Activity, CheckCircle, Clock, Server, RefreshCw } from 'lucide-react';
import { SYSTEM_FEEDS_STATUS } from '../../data/systemHealth';

export function SystemStatusCard() {
  const onlineCount = SYSTEM_FEEDS_STATUS.filter(f => f.status === 'optimal' || f.status === 'stable').length;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 shadow-subtle hover:shadow-card transition-all">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">System & Model Telemetry</h3>
            <p className="text-[11px] text-slate-500">Live ingestion pipelines and WMO GTS telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{onlineCount}/{SYSTEM_FEEDS_STATUS.length} Feeds Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2">
        {SYSTEM_FEEDS_STATUS.slice(0, 3).map((feed) => (
          <div key={feed.id} className="p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-[11px] line-clamp-1">{feed.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Latency: {feed.latency}</span>
              <span className="text-slate-400 font-mono">{feed.lastSync}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Automated dynamic weight rebalancing active if any model stream fails.</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <RefreshCw className="w-3 h-3" />
          <span>Auto-sync cycle: 12Z Run</span>
        </div>
      </div>
    </div>
  );
}
