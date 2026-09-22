import React, { useState, useEffect } from 'react';
import { 
  GeoLocation, 
  LeadTimeHours, 
  ScenarioPreset, 
  WeatherRegime,
  ForecastVariable
} from './types/weather';
import { GLOBAL_LOCATIONS } from './data/locations';
import { DEMO_SCENARIOS } from './data/scenarios';
import { computeHybridForecast } from './engine/blendingEngine';
import { evaluateExtremeRisks, DEFAULT_THRESHOLDS } from './engine/extremeWeatherEngine';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardView } from './components/dashboard/DashboardView';
import { ForecastExplorerView } from './components/explorer/ForecastExplorerView';
import { BlendingStudioView } from './components/blending/BlendingStudioView';
import { WeatherMapView } from './components/map/WeatherMapView';
import { ExtremeWeatherView } from './components/extreme/ExtremeWeatherView';
import { RegimeDetectionView } from './components/regime/RegimeDetectionView';
import { AccuracyValidationView } from './components/validation/AccuracyValidationView';
import { MethodologyView } from './components/methodology/MethodologyView';
import { ReportGeneratorView } from './components/report/ReportGeneratorView';

export function App() {
  // State with localStorage recall for selected location
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem('aurablend_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = GLOBAL_LOCATIONS.find(l => l.id === parsed.id);
        if (match) return match;
      } catch (e) {}
    }
    return GLOBAL_LOCATIONS[0]; // Default: Mumbai
  });

  const [leadTime, setLeadTime] = useState<LeadTimeHours>(24);
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>(DEMO_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedVariable, setSelectedVariable] = useState<ForecastVariable>('rainfall');

  // Sync location to local storage
  const handleSelectLocation = (loc: GeoLocation) => {
    setCurrentLocation(loc);
    localStorage.setItem('aurablend_location', JSON.stringify(loc));
  };

  // Scenario selection logic
  const handleSelectScenario = (sc: ScenarioPreset) => {
    setCurrentScenario(sc);
    const targetLoc = GLOBAL_LOCATIONS.find(l => l.id === sc.locationId);
    if (targetLoc) {
      setCurrentLocation(targetLoc);
      localStorage.setItem('aurablend_location', JSON.stringify(targetLoc));
    }
    setLeadTime(sc.leadTime);
  };

  // Active regime
  const activeRegime: WeatherRegime = currentScenario.regime || currentLocation.defaultRegime;

  // Compute live blended results for all main variables
  const rainfallBlend = computeHybridForecast({
    location: currentLocation,
    leadTime,
    variable: 'rainfall',
    scenarioRegime: activeRegime,
    customModelStatus: currentScenario.modelModifications?.nwpB?.status ? { nwpB: currentScenario.modelModifications.nwpB.status } : undefined
  });

  const tempBlend = computeHybridForecast({
    location: currentLocation,
    leadTime,
    variable: 'temperature',
    scenarioRegime: activeRegime,
    customModelStatus: currentScenario.modelModifications?.nwpB?.status ? { nwpB: currentScenario.modelModifications.nwpB.status } : undefined
  });

  const windBlend = computeHybridForecast({
    location: currentLocation,
    leadTime,
    variable: 'wind',
    scenarioRegime: activeRegime,
    customModelStatus: currentScenario.modelModifications?.nwpB?.status ? { nwpB: currentScenario.modelModifications.nwpB.status } : undefined
  });

  const extremeRisks = evaluateExtremeRisks(currentLocation, activeRegime, DEFAULT_THRESHOLDS);
  const activeAlertCount = extremeRisks.filter(r => r.riskLevel === 'severe' || r.riskLevel === 'high').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* Main Header & Navigation */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        leadTime={leadTime}
        onChangeLeadTime={setLeadTime}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            location={currentLocation}
            leadTime={leadTime}
            regime={activeRegime}
            rainfallBlend={rainfallBlend}
            tempBlend={tempBlend}
            windBlend={windBlend}
            extremeRisks={extremeRisks}
            onNavigateTab={setActiveTab}
            onSelectVariable={(v) => setSelectedVariable(v as ForecastVariable)}
          />
        )}

        {activeTab === 'explorer' && (
          <ForecastExplorerView
            location={currentLocation}
            currentLeadTime={leadTime}
            onChangeLeadTime={setLeadTime}
            regime={activeRegime}
            defaultVariable={selectedVariable}
          />
        )}

        {activeTab === 'blending' && (
          <BlendingStudioView
            location={currentLocation}
            leadTime={leadTime}
            regime={activeRegime}
          />
        )}

        {activeTab === 'map' && (
          <WeatherMapView
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            leadTime={leadTime}
            onChangeLeadTime={setLeadTime}
            regime={activeRegime}
          />
        )}

        {activeTab === 'extreme' && (
          <ExtremeWeatherView
            location={currentLocation}
            regime={activeRegime}
          />
        )}

        {activeTab === 'regime' && (
          <RegimeDetectionView
            location={currentLocation}
            leadTime={leadTime}
            currentRegime={activeRegime}
          />
        )}

        {activeTab === 'validation' && (
          <AccuracyValidationView />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}

        {activeTab === 'report' && (
          <ReportGeneratorView
            location={currentLocation}
            leadTime={leadTime}
            regime={activeRegime}
            rainfallBlend={rainfallBlend}
            tempBlend={tempBlend}
            windBlend={windBlend}
            extremeRisks={extremeRisks}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
