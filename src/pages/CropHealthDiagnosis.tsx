import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DiagnosisResult {
  issue: string;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low';
  affectedArea: string;
  treatment: string[];
  prevention: string[];
}

const MOCK_RESULTS: DiagnosisResult[] = [
  {
    issue: 'Late Blight (Phytophthora infestans)',
    confidence: 94,
    severity: 'High',
    affectedArea: '35% of visible leaf area',
    treatment: [
      'Apply Mancozeb 75% WP @ 2.5 kg/ha with water',
      'Use copper-based fungicide as protective spray',
      'Remove and destroy infected plant parts immediately',
      'Apply Ridomil Gold MZ 68 WG @ 2.5 g/litre',
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Maintain proper plant spacing for airflow',
      'Avoid overhead irrigation',
      'Rotate crops to break disease cycle',
    ],
  },
  {
    issue: 'Nitrogen Deficiency',
    confidence: 87,
    severity: 'Medium',
    affectedArea: 'Older lower leaves yellowing',
    treatment: [
      'Apply Urea @ 50 kg/ha as top dressing',
      'Use foliar spray of 2% Urea solution',
      'Apply well-decomposed FYM @ 10 t/ha',
    ],
    prevention: [
      'Conduct soil test before planting',
      'Apply balanced fertilizers based on soil test',
      'Use green manure crops in rotation',
    ],
  },
  {
    issue: 'Aphid Infestation',
    confidence: 91,
    severity: 'Medium',
    affectedArea: 'New growth and underside of leaves',
    treatment: [
      'Spray Imidacloprid 17.8 SL @ 0.5 ml/litre',
      'Apply Neem oil 3% or NSKE 5%',
      'Use yellow sticky traps to monitor population',
    ],
    prevention: [
      'Encourage natural predators (ladybirds, lacewings)',
      'Avoid excessive nitrogen fertilizers',
      'Use resistant varieties when available',
    ],
  },
];

export default function CropHealthDiagnosis() {
  const { t } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Revoke stale object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleImageSelect(file);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) return;
    setAnalyzing(true);
    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 2500));
    const randomResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
    setResult(randomResult);
    setAnalyzing(false);
  };

  const severityColor = (s: string) =>
    s === 'High' ? '#f44336' : s === 'Medium' ? '#ff9800' : '#4caf50';

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔬 {t.cropHealthTitle}</h1>
        <p>{t.cropHealthSubtitle}</p>
      </div>

      <div className="content-grid two-col">
        {/* Upload Section */}
        <div className="card">
          <h3>{t.uploadPhoto}</h3>
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Crop" className="uploaded-image" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📸</span>
                <p>{t.dragDropText}</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            className="btn btn-primary btn-large"
            onClick={handleAnalyze}
            disabled={!imageUrl || analyzing}
          >
            {analyzing ? `⏳ ${t.analyzing}` : `🔍 ${t.analyzeBtn}`}
          </button>
        </div>

        {/* Result Section */}
        <div className="card">
          <h3>🧪 {t.cropHealthResults}</h3>
          {!result && !analyzing && (
            <div className="empty-state">
              <span>🌿</span>
              <p>Upload a crop image and click Analyze to get AI diagnosis</p>
            </div>
          )}
          {analyzing && (
            <div className="analyzing-state">
              <div className="spinner"></div>
              <p>{t.analyzing}</p>
              <p className="hint">AI is examining your crop image...</p>
            </div>
          )}
          {result && (
            <div className="diagnosis-result">
              <div className="result-header">
                <h4>{result.issue}</h4>
                <span
                  className="severity-badge"
                  style={{ background: severityColor(result.severity) }}
                >
                  {result.severity}
                </span>
              </div>
              <div className="result-meta">
                <div className="meta-item">
                  <span className="meta-label">{t.confidence}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${result.confidence}%` }}></div>
                  </div>
                  <span>{result.confidence}%</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">{t.affectedArea}</span>
                  <span>{result.affectedArea}</span>
                </div>
              </div>
              <div className="result-section">
                <h5>💊 {t.treatment}</h5>
                <ul>
                  {result.treatment.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="result-section">
                <h5>🛡️ {t.prevention}</h5>
                <ul>
                  {result.prevention.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
