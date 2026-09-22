# AuraBlend AI — Hybrid AI–NWP Multi-Model Forecast Blending System

> An intelligent, explainable meteorological intelligence platform that fuses **Physical Numerical Weather Prediction (ECMWF IFS, NOAA GFS)**, **50-Member Perturbed Ensembles (Multi-EPS)**, and **AI/ML Deep Atmospheric Surrogates (AtmosML Neural-Graph)** using dynamic adaptive weighting, atmospheric regime classification, statistical uncertainty estimation, and comprehensive WMO-485 validation.

---

## 🌪️ Key Features

- **Progressive Disclosure Dashboard**: Real-time readouts for Rainfall ($mm$), Temperature ($^\circ\text{C}$), Wind Speed ($km/h$), and Hazard Exceedance Risk with statistical confidence intervals ($[lower - upper]$).
- **Multi-Model Convergence Trajectory**: Interactive trajectory chart with shaded confidence area envelopes and toggleable model overlays.
- **Explainable AI Attribution ("Why This Forecast?")**: Deconstructs every prediction into verifiable contributing factors (Historical Skill 35%, Model Agreement 25%, Regime Physics 20%, Lead Time 10%, Regional Prior 10%).
- **Dynamic Normalization Engine**: Mathematically guarantees $\sum w_i = 100\%$ across all lead times ($0\text{h} \to 120\text{h}$) and active weather regimes.
- **Interactive What-If Simulation Sandbox**: Test model dropouts (auto-rebalancing) and scale reliability multipliers ($0.2\times\text{–}1.8\times$) in real time.
- **Geographic Model Weight & Weather Map**: Interactive global synoptic radar grid visualizing model dominance zones and localized weights.
- **Atmospheric Weather Regime Detection**: Diagnostic classifier covering Monsoon, Heavy Rainfall, Heat-Wave, High-Wind / Gale, Convective Instability, Dry Anticyclone, and Frontal Transition regimes.
- **Accuracy & Statistical Verification**: Standard WMO-485 metrics (**RMSE**, **MAE**, **Bias**, **Pearson Correlation ($r$)**, **Brier Score**, and **Skill Score**) alongside 5-day rolling ground-truth backtests.
- **Printable Meteorological Dossier & Export**: One-click **Print / Save PDF** briefing reports and instant **CSV / JSON** dataset exports.

---

## 🏗️ Architecture & Mathematical Formulation

### Dynamic Weighting Formula
$$w_i(t, \text{regime}) = \frac{S_i \cdot L_i(t) \cdot R_i(\text{regime}) \cdot Q_i}{\sum_{k=1}^N S_k \cdot L_k(t) \cdot R_k(\text{regime}) \cdot Q_k}$$

Where:
- $S_i$: Base 3-year verified WMO historical skill score.
- $L_i(t)$: Lead-time decay / expansion curve (AI models lead $0\text{–}24\text{h}$, Multi-EPS leads $48\text{–}120\text{h}$).
- $R_i(\text{regime})$: Atmospheric regime physics multiplier (e.g., ECMWF boundary-layer moisture boost during heavy monsoon flow).
- $Q_i$: Operational data stream availability ($0$ if feed drops offline).

### Blended Forecast
$$\hat{Y}_{\text{hybrid}}(t) = \sum_{i=1}^N w_i(t, \text{regime}) \cdot \hat{y}_i(t)$$

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/aurablend-ai.git
cd aurablend-ai

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Production Build

```bash
npm run build
```

---

## 📊 Models Integrated

| Model Name | Type | Resolution | Key Strength |
| :--- | :--- | :--- | :--- |
| **AtmosML Neural-Graph** | AI/ML Surrogate (GraphCast/FourCastNet) | 0.25° (~25km) | Rapid short-range non-linear synoptic mapping (0–36h) |
| **EC-IFS High-Res** | Physical NWP (ECMWF Cy48r1) | 9km Deterministic | Superior boundary-layer moisture & pressure physics |
| **NOAA GFS-FV3** | Physical NWP (NCEP NOMADS) | 13km Spectral | Consistent thermal profiles & upper-level jet streaks |
| **Global Multi-EPS** | 50-Member Perturbed Ensemble | 18km (50 Members) | Captures tail probability risks & chaotic spread (48–120h) |

---

## 📜 License
MIT License. Built for meteorological research and multi-model forecast synthesis.
