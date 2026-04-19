import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SoilParams {
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: string;
  ec: string;
  texture: string;
}

interface WaterParams {
  ph: string;
  ec: string;
  bicarbonate: string;
  chloride: string;
  sodium: string;
}

interface AnalysisResult {
  soilScore: number;
  waterQuality: string;
  suitableCrops: { name: string; suitability: 'High' | 'Medium' | 'Low'; reason: string }[];
  amendments: string[];
  warnings: string[];
}

function analyzeSoilWater(soil: SoilParams, water: WaterParams): AnalysisResult {
  const ph = parseFloat(soil.ph) || 7;
  const n = parseFloat(soil.nitrogen) || 50;
  const p = parseFloat(soil.phosphorus) || 15;
  const k = parseFloat(soil.potassium) || 150;
  const om = parseFloat(soil.organicMatter) || 0.8;
  const wPh = parseFloat(water.ph) || 7;
  const wEc = parseFloat(water.ec) || 1.0;

  // Simple soil score calculation
  const phScore = ph >= 6.5 && ph <= 7.5 ? 25 : ph >= 6 && ph <= 8 ? 15 : 5;
  const nScore = n >= 50 ? 20 : n >= 30 ? 15 : 5;
  const pScore = p >= 15 ? 15 : p >= 10 ? 10 : 5;
  const kScore = k >= 150 ? 15 : k >= 100 ? 10 : 5;
  const omScore = om >= 1.5 ? 25 : om >= 0.8 ? 15 : 5;
  const soilScore = phScore + nScore + pScore + kScore + omScore;

  const waterQuality = wEc < 1.5 ? 'Good' : wEc < 3 ? 'Moderate' : 'Poor';

  const crops: AnalysisResult['suitableCrops'] = [];

  // pH-based recommendations
  if (ph >= 6.0 && ph <= 7.5) {
    crops.push({ name: 'Wheat', suitability: 'High', reason: 'Ideal pH and nutrient levels' });
    crops.push({ name: 'Maize', suitability: 'High', reason: 'Neutral pH suits maize perfectly' });
    crops.push({ name: 'Tomato', suitability: 'High', reason: 'Good pH range for tomato cultivation' });
    crops.push({ name: 'Soybean', suitability: 'Medium', reason: 'Good conditions; add Rhizobium inoculant' });
  }
  if (ph >= 6.5 && ph <= 8.0) {
    crops.push({ name: 'Cotton', suitability: 'High', reason: 'Slightly alkaline pH suitable for cotton' });
    crops.push({ name: 'Sugarcane', suitability: 'High', reason: 'Neutral to slightly alkaline suits sugarcane' });
  }
  if (ph < 6.0) {
    crops.push({ name: 'Rice', suitability: 'High', reason: 'Prefers slightly acidic conditions' });
    crops.push({ name: 'Potato', suitability: 'High', reason: 'Grows well in acidic soils' });
    crops.push({ name: 'Wheat', suitability: 'Low', reason: 'pH too acidic; lime amendment needed first' });
  }
  if (wEc > 2.0) {
    crops.push({ name: 'Barley', suitability: 'High', reason: 'Salt-tolerant crop suitable for your water quality' });
    crops.push({ name: 'Wheat', suitability: 'Medium', reason: 'Moderate salt tolerance' });
  }

  // Always add some diverse options
  if (om >= 1.5) {
    crops.push({ name: 'Vegetables (mixed)', suitability: 'High', reason: 'Good organic matter content supports vegetable farming' });
  }
  crops.push({ name: 'Pulses (Chickpea/Lentil)', suitability: 'Medium', reason: 'Legumes improve soil nitrogen while providing yield' });

  const amendments: string[] = [];
  const warnings: string[] = [];

  if (ph < 6.0) amendments.push('Apply Agricultural Lime at 2-4 tonnes/ha to raise pH');
  if (ph > 8.0) amendments.push('Apply Gypsum at 3-5 tonnes/ha or Sulphur at 500 kg/ha to lower pH');
  if (n < 30) amendments.push('Apply 80-100 kg/ha Urea in split doses to correct nitrogen deficiency');
  if (p < 10) amendments.push('Apply Single Super Phosphate (SSP) at 250 kg/ha');
  if (k < 100) amendments.push('Apply Muriate of Potash (MOP) at 100 kg/ha');
  if (om < 0.8) amendments.push('Apply well-decomposed FYM/Compost at 5-10 tonnes/ha to improve organic matter');
  if (wEc > 3) warnings.push('⚠️ Water is highly saline. Install leaching drainage; apply gypsum to soil before irrigation');
  if (wPh > 8.5) warnings.push('⚠️ Irrigation water is highly alkaline. May cause nutrient deficiencies in sensitive crops');

  return { soilScore, waterQuality, suitableCrops: crops.slice(0, 6), amendments, warnings };
}

export default function SoilWaterAnalysis() {
  const { t } = useLanguage();
  const [soil, setSoil] = useState<SoilParams>({ ph: '', nitrogen: '', phosphorus: '', potassium: '', organicMatter: '', ec: '', texture: '' });
  const [water, setWater] = useState<WaterParams>({ ph: '', ec: '', bicarbonate: '', chloride: '', sodium: '' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'soil' | 'water'>('soil');

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult(analyzeSoilWater(soil, water));
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      // Simulate parsing report values
      setSoil({ ph: '6.8', nitrogen: '42', phosphorus: '18', potassium: '165', organicMatter: '1.2', ec: '0.8', texture: 'Loamy' });
      setWater({ ph: '7.2', ec: '1.1', bicarbonate: '4.5', chloride: '6.2', sodium: '8.1' });
    }
  };

  const suitabilityColor = (s: string) =>
    s === 'High' ? '#4caf50' : s === 'Medium' ? '#ff9800' : '#f44336';

  return (
    <div className="page">
      <div className="page-header">
        <h1>🧪 {t.soilWaterTitle}</h1>
        <p>{t.soilWaterSubtitle}</p>
      </div>

      <div className="content-grid two-col">
        {/* Input Section */}
        <div className="card">
          {/* File Upload */}
          <div className="upload-report-section">
            <h3>📄 {t.uploadReport}</h3>
            <label className="file-upload-btn">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} style={{ display: 'none' }} />
              📁 Upload Soil/Water Test Report
            </label>
            {uploadedFile && (
              <div className="uploaded-file">
                ✅ {uploadedFile} — Values auto-filled below
              </div>
            )}
          </div>

          <div className="divider">or enter manually</div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'soil' ? 'active' : ''}`} onClick={() => setActiveTab('soil')}>
              🌍 Soil Parameters
            </button>
            <button className={`tab ${activeTab === 'water' ? 'active' : ''}`} onClick={() => setActiveTab('water')}>
              💧 Water Parameters
            </button>
          </div>

          {activeTab === 'soil' && (
            <div className="param-form">
              {[
                { key: 'ph', label: `${t.ph} (e.g. 6.5–7.5)`, placeholder: '7.0' },
                { key: 'nitrogen', label: `${t.nitrogen} (kg/ha)`, placeholder: '50' },
                { key: 'phosphorus', label: `${t.phosphorus} (kg/ha)`, placeholder: '15' },
                { key: 'potassium', label: `${t.potassium} (kg/ha)`, placeholder: '150' },
                { key: 'organicMatter', label: `${t.organicMatter} (%)`, placeholder: '1.0' },
                { key: 'ec', label: 'EC (dS/m)', placeholder: '0.5' },
              ].map(field => (
                <div key={field.key} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type="number"
                    value={soil[field.key as keyof SoilParams]}
                    onChange={e => setSoil(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    step="0.1"
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Soil Texture</label>
                <select value={soil.texture} onChange={e => setSoil(prev => ({ ...prev, texture: e.target.value }))}>
                  <option value="">Select texture</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Clay">Clay</option>
                  <option value="Black Cotton">Black Cotton (Vertisol)</option>
                  <option value="Red Laterite">Red Laterite</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'water' && (
            <div className="param-form">
              {[
                { key: 'ph', label: 'Water pH', placeholder: '7.0' },
                { key: 'ec', label: 'EC (dS/m)', placeholder: '1.0' },
                { key: 'bicarbonate', label: 'Bicarbonate (meq/L)', placeholder: '4.0' },
                { key: 'chloride', label: 'Chloride (meq/L)', placeholder: '5.0' },
                { key: 'sodium', label: 'Sodium (meq/L)', placeholder: '8.0' },
              ].map(field => (
                <div key={field.key} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type="number"
                    value={water[field.key as keyof WaterParams]}
                    onChange={e => setWater(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    step="0.1"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-primary btn-large"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? `⏳ ${t.loading}` : `🧪 ${t.analyzeReport}`}
          </button>
        </div>

        {/* Result Section */}
        <div className="card">
          <h3>📊 {t.reportAnalysis}</h3>
          {!result && (
            <div className="empty-state">
              <span>🧪</span>
              <p>Enter soil and water parameters to get AI crop suitability analysis</p>
            </div>
          )}
          {result && (
            <div className="analysis-result">
              {/* Scores */}
              <div className="score-grid">
                <div className="score-card">
                  <span>{t.soilHealthScore}</span>
                  <div className="score-circle" style={{ borderColor: result.soilScore >= 70 ? '#4caf50' : result.soilScore >= 50 ? '#ff9800' : '#f44336' }}>
                    <span>{result.soilScore}</span>
                    <small>/100</small>
                  </div>
                </div>
                <div className="score-card">
                  <span>{t.waterQuality}</span>
                  <div className={`water-quality-badge quality-${result.waterQuality.toLowerCase()}`}>
                    {result.waterQuality}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="warnings-box">
                  {result.warnings.map((w, i) => <p key={i}>{w}</p>)}
                </div>
              )}

              {/* Suitable Crops */}
              <h4>🌾 {t.suitableCrops}</h4>
              <div className="suitable-crops">
                {result.suitableCrops.map((crop, i) => (
                  <div key={i} className="crop-suitability-item">
                    <div className="crop-suit-header">
                      <span className="crop-suit-name">{crop.name}</span>
                      <span className="suit-badge" style={{ background: suitabilityColor(crop.suitability) }}>
                        {crop.suitability}
                      </span>
                    </div>
                    <p className="crop-suit-reason">{crop.reason}</p>
                  </div>
                ))}
              </div>

              {/* Amendments */}
              {result.amendments.length > 0 && (
                <div className="amendments-section">
                  <h4>🔧 Recommended Amendments</h4>
                  <ul>
                    {result.amendments.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
