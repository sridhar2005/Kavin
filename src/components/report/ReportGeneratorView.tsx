import React, { useState } from 'react';
import { 
  GeoLocation, 
  LeadTimeHours, 
  WeatherRegime, 
  BlendedForecastResult,
  ExtremeRiskItem 
} from '../../types/weather';
import { HISTORICAL_ACCURACY_DATA } from '../../data/accuracyData';
import { 
  Printer, 
  Download, 
  FileText, 
  FileJson, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  CloudSun
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportGeneratorViewProps {
  location: GeoLocation;
  leadTime: LeadTimeHours;
  regime: WeatherRegime;
  rainfallBlend: BlendedForecastResult;
  tempBlend: BlendedForecastResult;
  windBlend: BlendedForecastResult;
  extremeRisks: ExtremeRiskItem[];
}

export function ReportGeneratorView({
  location,
  leadTime,
  regime,
  rainfallBlend,
  tempBlend,
  windBlend,
  extremeRisks
}: ReportGeneratorViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      platform: "AuraBlend AI - Hybrid AI-NWP Blending System",
      timestamp: new Date().toISOString(),
      location: {
        name: location.name,
        country: location.country,
        coordinates: { lat: location.lat, lon: location.lon },
        climateZone: location.climateZone
      },
      forecastLeadTimeHours: leadTime,
      activeRegime: regime,
      blendedForecasts: {
        rainfall: {
          value: rainfallBlend.blendedValue,
          unit: rainfallBlend.unit,
          uncertaintyRange: rainfallBlend.uncertaintyRange,
          confidencePercent: rainfallBlend.confidencePercent,
          agreementScore: rainfallBlend.agreementScore,
          contributions: rainfallBlend.contributions
        },
        temperature: {
          value: tempBlend.blendedValue,
          unit: tempBlend.unit,
          uncertaintyRange: tempBlend.uncertaintyRange,
          confidencePercent: tempBlend.confidencePercent
        },
        wind: {
          value: windBlend.blendedValue,
          unit: windBlend.unit,
          uncertaintyRange: windBlend.uncertaintyRange,
          confidencePercent: windBlend.confidencePercent
        }
      },
      extremeWeatherRisks: extremeRisks,
      historicalAccuracyMetrics: HISTORICAL_ACCURACY_DATA
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuraBlend_Report_${location.id}_T${leadTime}h.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Exported JSON successfully!');
    try { confetti({ particleCount: 40, spread: 60 }); } catch (e) {}
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportCSV = () => {
    let csv = `AuraBlend AI Meteorological Dossier - ${location.name}\n`;
    csv += `Timestamp,${new Date().toISOString()}\n`;
    csv += `Location,${location.name},Country,${location.country},Lat,${location.lat},Lon,${location.lon}\n`;
    csv += `Lead Time,+${leadTime} Hours,Weather Regime,${regime}\n\n`;

    csv += `BLENDED FORECASTS SUMMARY\n`;
    csv += `Variable,Blended Value,Unit,Uncertainty Lower,Uncertainty Upper,Confidence %,Agreement %\n`;
    csv += `Rainfall,${rainfallBlend.blendedValue},mm,${rainfallBlend.uncertaintyRange.lower},${rainfallBlend.uncertaintyRange.upper},${rainfallBlend.confidencePercent},${rainfallBlend.agreementScore}\n`;
    csv += `Temperature,${tempBlend.blendedValue},°C,${tempBlend.uncertaintyRange.lower},${tempBlend.uncertaintyRange.upper},${tempBlend.confidencePercent},${tempBlend.agreementScore}\n`;
    csv += `Wind Speed,${windBlend.blendedValue},km/h,${windBlend.uncertaintyRange.lower},${windBlend.uncertaintyRange.upper},${windBlend.confidencePercent},${windBlend.agreementScore}\n\n`;

    csv += `DYNAMIC MODEL WEIGHT CONTRIBUTIONS (Rainfall)\n`;
    csv += `Model Name,Type,Raw Prediction (mm),Historical Skill %,Dynamic Weight %,Contribution (mm)\n`;
    rainfallBlend.contributions.forEach(c => {
      csv += `${c.modelName},${c.type},${c.predictedValue},${c.historicalSkill},${Math.round(c.adaptiveWeight * 100)}%,${c.finalContribution}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuraBlend_Forecast_${location.id}_T${leadTime}h.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Exported CSV successfully!');
    try { confetti({ particleCount: 40, spread: 60 }); } catch (e) {}
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Action Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 shadow-subtle bg-white no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs uppercase shadow-xs">
                Dossier Generation
              </span>
              <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-semibold">
                Print & Export Ready
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Meteorological Briefing Report & Data Export
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate publication-quality meteorological briefing dossiers and export raw model weight datasets for {location.name}.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Printable Report Dossier Card (Designed for clean PDF print) */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                AuraBlend AI — Meteorological Briefing Dossier
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Document Ref: AB-RPT-{location.id.toUpperCase()}-{new Date().toISOString().slice(0, 10)}
            </p>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="font-bold text-slate-900">Generated: {new Date().toLocaleDateString()}</div>
            <div className="text-slate-500">Cycle: 12Z Operational Blend</div>
            <div className="text-blue-700 font-bold">Horizon: +{leadTime}h ({leadTime === 0 ? 'Now' : `${(leadTime/24).toFixed(1)} Days`})</div>
          </div>
        </div>

        {/* Location & Regime Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <div className="text-slate-400 uppercase font-bold text-[10px]">Location</div>
            <div className="font-bold text-slate-900 mt-0.5">{location.name}, {location.country}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase font-bold text-[10px]">Coordinates</div>
            <div className="font-mono text-slate-700 mt-0.5">{location.lat}°N, {location.lon}°E</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase font-bold text-[10px]">Active Regime</div>
            <div className="font-bold text-indigo-700 mt-0.5">{regime}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase font-bold text-[10px]">Confidence Index</div>
            <div className="font-bold text-emerald-700 mt-0.5">{rainfallBlend.confidencePercent}% ({rainfallBlend.confidenceLevel})</div>
          </div>
        </div>

        {/* Section 1: Executive Forecast Synthesis */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
            1. Executive Multi-Variable Blended Forecast
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-slate-500 text-xs font-semibold">Precipitation Accumulation</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {rainfallBlend.blendedValue} mm
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                Range: [{rainfallBlend.uncertaintyRange.lower} – {rainfallBlend.uncertaintyRange.upper} mm]
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-slate-500 text-xs font-semibold">Surface Temperature (2m)</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {tempBlend.blendedValue} °C
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">
                Range: [{tempBlend.uncertaintyRange.lower}° – {tempBlend.uncertaintyRange.upper}°C]
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-slate-500 text-xs font-semibold">Mean Wind Speed (10m)</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {windBlend.blendedValue} km/h
              </div>
              <div className="text-[11px] text-teal-700 mt-0.5">
                Gusts to: {(windBlend.blendedValue * 1.35).toFixed(0)} km/h
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Model Weight Attribution Decomposition */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
            2. Multi-Model Attribution & Dynamic Weighting Table
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="p-2.5">Model Source</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5 text-right">Predicted Value</th>
                <th className="p-2.5 text-right">Historical Skill</th>
                <th className="p-2.5 text-right">Dynamic Weight %</th>
                <th className="p-2.5 text-right">Net Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {rainfallBlend.contributions.map((c) => (
                <tr key={c.modelId}>
                  <td className="p-2.5 font-sans font-medium text-slate-900">{c.modelName}</td>
                  <td className="p-2.5 font-sans text-slate-500 text-[11px]">{c.type}</td>
                  <td className="p-2.5 text-right">{c.predictedValue} mm</td>
                  <td className="p-2.5 text-right">{c.historicalSkill}%</td>
                  <td className="p-2.5 text-right font-bold text-blue-700">{Math.round(c.adaptiveWeight * 100)}%</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">+{c.finalContribution} mm</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold font-sans text-slate-900 border-t border-slate-200">
                <td className="p-2.5">Hybrid Synthesized Total</td>
                <td className="p-2.5 text-slate-500">$\sum w_i = 100\%$</td>
                <td className="p-2.5 text-right font-mono" colSpan={3}>Weighted Linear Combination</td>
                <td className="p-2.5 text-right font-mono text-indigo-900">{rainfallBlend.blendedValue} mm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Explainability Narrative */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="font-bold text-slate-900">Explainability Summary:</div>
          <p className="text-slate-600 leading-relaxed">
            {rainfallBlend.explainability.summaryText} {rainfallBlend.confidenceReason}
          </p>
        </div>

        {/* Report Footer */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <span>AuraBlend AI Meteorological Research Platform</span>
          <span>Simulation Mode · Confidential Briefing</span>
        </div>

      </div>

    </div>
  );
}
