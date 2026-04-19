import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Advisory {
  plantingSchedule: string;
  irrigationAdvice: string;
  pestControl: string;
  weatherAlert: string;
  bestPractices: string[];
}

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];
const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Tomato', 'Onion', 'Potato', 'Chilli', 'Groundnut', 'Sunflower'];

function generateAdvisory(crop: string, soil: string, state: string): Advisory {
  const advisories: Record<string, Advisory> = {
    Wheat: {
      plantingSchedule: 'Optimal sowing: October 15 – November 15. Use certified seeds at 100 kg/ha. Row spacing: 22.5 cm.',
      irrigationAdvice: 'Apply 6 irrigations: Crown Root Initiation (CRI), Tillering, Jointing, Flowering, Grain Filling, and Dough stage.',
      pestControl: 'Monitor for Yellow Rust and Aphids. Apply Propiconazole for rust. Use Imidacloprid for aphid control.',
      weatherAlert: '⚠️ Light frost expected this week. Cover young seedlings or apply anti-frost measures.',
      bestPractices: [
        'Apply 120-60-40 kg/ha NPK fertilizer as basal dose',
        'Use zero tillage or minimum tillage to conserve moisture',
        'Harvest at 13–14% grain moisture for optimal storage',
        'Store grain below 12% moisture to prevent mold',
      ],
    },
    Rice: {
      plantingSchedule: 'Transplant: June 15 – July 15 in kharif season. Use 25–30 day old seedlings. Spacing: 20x15 cm.',
      irrigationAdvice: 'Maintain 5 cm standing water for first 3 weeks. Alternate wetting and drying (AWD) saves 30% water.',
      pestControl: 'Check for Brown Plant Hopper (BPH) and Blast disease. Apply Tricyclazole for blast. Use Cartap for BPH.',
      weatherAlert: '🌧️ Heavy rainfall expected. Ensure proper drainage to prevent waterlogging damage.',
      bestPractices: [
        'Use SRI (System of Rice Intensification) for 20-30% higher yield',
        'Apply split dose of nitrogen: 50% basal, 25% at tillering, 25% at panicle initiation',
        'Keep fields clean to reduce weed competition',
        'Harvest at 20-25% grain moisture; field dry to 14% before storage',
      ],
    },
  };

  const base = advisories[crop] || {
    plantingSchedule: `For ${crop} in ${state}: Consult your local Krishi Vigyan Kendra (KVK) for state-specific sowing dates. Generally sow after first monsoon rains.`,
    irrigationAdvice: `Irrigate ${crop} based on soil moisture. Apply water when topsoil dries to 2 cm depth. Drip irrigation recommended for water saving.`,
    pestControl: `Regular scouting of ${crop} fields recommended. Use pheromone traps for pest monitoring. Apply IPM-based control measures.`,
    weatherAlert: '☀️ Clear skies expected for next 5 days. Good conditions for field operations.',
    bestPractices: [
      'Conduct soil test before every season for optimal fertilizer application',
      'Use certified disease-free seeds from registered dealers',
      'Follow crop rotation to break pest and disease cycles',
      `Join local ${state} farmer cooperative for market access`,
    ],
  };

  if (soil === 'Sandy') {
    base.irrigationAdvice += ' Sandy soils need more frequent, lighter irrigations due to low water retention.';
  } else if (soil === 'Clay') {
    base.irrigationAdvice += ' Clay soils retain water well — avoid over-irrigation to prevent waterlogging.';
  }

  return base;
}

export default function SmartFarmingAdvisory() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('');
  const [location, setLocation] = useState(user?.state || '');
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!crop || !soil || !location) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setAdvisory(generateAdvisory(crop, soil, location));
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌾 {t.advisoryTitle}</h1>
        <p>{t.advisorySubtitle}</p>
      </div>

      <div className="content-grid two-col">
        <div className="card">
          <h3>🗺️ Farm Details</h3>
          <div className="form-group">
            <label>{t.yourLocation}</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Maharashtra, Pune District"
            />
          </div>
          <div className="form-group">
            <label>{t.cropName}</label>
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              <option value="">Select crop</option>
              {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t.soilType}</label>
            <select value={soil} onChange={e => setSoil(e.target.value)}>
              <option value="">Select soil type</option>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            className="btn btn-primary btn-large"
            onClick={handleGetAdvice}
            disabled={!crop || !soil || !location || loading}
          >
            {loading ? `⏳ ${t.loading}` : `🌾 ${t.getAdvice}`}
          </button>
        </div>

        <div className="card">
          <h3>📋 {t.advisory}</h3>
          {!advisory && (
            <div className="empty-state">
              <span>🌾</span>
              <p>Fill in your farm details and get personalized advice</p>
            </div>
          )}
          {advisory && (
            <div className="advisory-result">
              <div className="advisory-item">
                <h4>🗓️ {t.plantingSchedule}</h4>
                <p>{advisory.plantingSchedule}</p>
              </div>
              <div className="advisory-item">
                <h4>💧 {t.irrigationAdvice}</h4>
                <p>{advisory.irrigationAdvice}</p>
              </div>
              <div className="advisory-item">
                <h4>🐛 {t.pestControl}</h4>
                <p>{advisory.pestControl}</p>
              </div>
              <div className="advisory-item weather-alert">
                <h4>⛅ {t.weatherAlert}</h4>
                <p>{advisory.weatherAlert}</p>
              </div>
              <div className="advisory-item">
                <h4>✅ Best Practices</h4>
                <ul>
                  {advisory.bestPractices.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
