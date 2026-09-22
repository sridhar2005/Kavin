import React, { useState } from 'react';
import { 
  CloudSun, 
  MapPin, 
  Sliders, 
  Layers, 
  AlertOctagon, 
  BarChart3, 
  FileText, 
  Cpu, 
  Search, 
  Clock, 
  Compass,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { GeoLocation, LeadTimeHours, ScenarioPreset } from '../../types/weather';
import { GLOBAL_LOCATIONS } from '../../data/locations';
import { DEMO_SCENARIOS } from '../../data/scenarios';

interface HeaderProps {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  leadTime: LeadTimeHours;
  onChangeLeadTime: (lt: LeadTimeHours) => void;
  currentScenario: ScenarioPreset;
  onSelectScenario: (sc: ScenarioPreset) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  activeAlertCount: number;
}

export const LEAD_TIMES: LeadTimeHours[] = [0, 6, 12, 24, 48, 72, 120];

export const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: CloudSun },
  { id: 'explorer', label: 'Forecast Explorer', icon: Compass },
  { id: 'blending', label: 'Model Weights & Studio', icon: Sliders },
  { id: 'map', label: 'Weight & Weather Map', icon: Layers },
  { id: 'extreme', label: 'Extreme Weather', icon: AlertOctagon },
  { id: 'regime', label: 'Regime Detection', icon: Sparkles },
  { id: 'validation', label: 'Accuracy & Verification', icon: BarChart3 },
  { id: 'methodology', label: 'Methodology & Pipeline', icon: Cpu },
  { id: 'report', label: 'Report & Export', icon: FileText },
];

export function Header({
  currentLocation,
  onSelectLocation,
  leadTime,
  onChangeLeadTime,
  currentScenario,
  onSelectScenario,
  activeTab,
  onChangeTab,
  activeAlertCount
}: HeaderProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = GLOBAL_LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.state && l.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Primary Brand & Context Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChangeTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#1e40af] flex items-center justify-center text-white shadow-xs">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 font-heading">
                  AuraBlend AI
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-50 text-[#1e40af] uppercase border border-blue-200 tracking-wider">
                  NWP Blending
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right Controls: Location, Scenario, Simulation Pill */}
          <div className="flex items-center gap-2">
            
            {/* Location Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#1e40af]" />
                <span className="font-semibold">{currentLocation.name}</span>
                <span className="text-slate-400 hidden sm:inline">· {currentLocation.country}</span>
              </button>

              {/* Location Dropdown Modal */}
              {isLocationModalOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search city or country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-0.5">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          onSelectLocation(loc);
                          setIsLocationModalOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          loc.id === currentLocation.id ? 'bg-blue-50 text-[#1e40af] font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{loc.name}, {loc.country}</div>
                          <div className="text-[10px] text-slate-400">{loc.climateZone}</div>
                        </div>
                        {loc.id === currentLocation.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#1e40af]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scenario Preset Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Scenario:
              </span>
              <select
                value={currentScenario.id}
                onChange={(e) => {
                  const sc = DEMO_SCENARIOS.find(s => s.id === e.target.value);
                  if (sc) onSelectScenario(sc);
                }}
                className="text-xs bg-white text-slate-800 font-medium py-0.5 px-2 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
              >
                {DEMO_SCENARIOS.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Simulation Notice Tag */}
            <div className="stitch-pill bg-amber-50 text-amber-900 border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-semibold text-[10px] tracking-wider uppercase">SIMULATION MODE</span>
            </div>

            {/* Active Alert Icon */}
            {activeAlertCount > 0 && (
              <button
                type="button"
                onClick={() => onChangeTab('extreme')}
                className="relative p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                title={`${activeAlertCount} active extreme weather advisories`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {activeAlertCount}
                </span>
              </button>
            )}

          </div>
        </div>

        {/* Global Horizon Slider Bar */}
        <div className="py-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#1e40af]" />
            <span className="font-semibold text-slate-700 text-xs">Lead Horizon:</span>
            <span className="font-mono font-bold text-[#1e40af] bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">
              {leadTime === 0 ? 'Analysis T+0h (Now)' : `T+${leadTime} Hours (${(leadTime / 24).toFixed(leadTime % 24 === 0 ? 0 : 1)}d)`}
            </span>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {LEAD_TIMES.map((lt) => (
              <button
                key={lt}
                type="button"
                onClick={() => onChangeLeadTime(lt)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tabular-nums transition-all ${
                  leadTime === lt 
                    ? 'bg-[#1e40af] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lt === 0 ? 'Now' : `+${lt}h`}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3 h-3 text-slate-400" />
            <span>AI Model dominates 0–24h · Multi-EPS dominates 48–120h</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="bg-slate-50/90 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#1e40af] border border-slate-200 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1e40af]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
