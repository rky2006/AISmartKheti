import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Method {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  benefits: string[];
  challenges: string[];
  suitableFor: string;
}

const METHODS: Method[] = [
  {
    id: 'organic', name: 'Organic Farming', icon: '🌿', color: '#4caf50',
    description: 'Uses only natural inputs — compost, bio-pesticides, and natural fertilizers. No synthetic chemicals allowed.',
    benefits: ['Premium market price (20-50% higher)', 'Safe for environment and consumers', 'Improves soil health long-term', 'Eligible for organic certification'],
    challenges: ['Lower yields initially (3-5 year transition)', 'Higher labor costs', 'Pest management more challenging'],
    suitableFor: 'Farmers near cities/export markets; small farms with diverse crops',
  },
  {
    id: 'chemical', name: 'Chemical / Conventional', icon: '🧪', color: '#2196f3',
    description: 'Uses synthetic fertilizers, pesticides, and herbicides for maximum yield. Most common farming method.',
    benefits: ['Higher short-term yields', 'Easier pest and weed control', 'Predictable results', 'Lower labor requirement'],
    challenges: ['High input costs', 'Soil health degradation over time', 'Environmental impact', 'Market accepts lower prices'],
    suitableFor: 'Large farms, commercial grain production, when market demands high volumes',
  },
  {
    id: 'ipm', name: 'Integrated Pest Management', icon: '🔄', color: '#ff9800',
    description: 'Combines biological, cultural, physical, and chemical tools to minimize pest damage with minimum environmental impact.',
    benefits: ['Reduces chemical use by 40-60%', 'Cost-effective pest management', 'Lower environmental impact', 'Better for beneficial insects'],
    challenges: ['Requires more knowledge and monitoring', 'Results may vary', 'Initial learning curve'],
    suitableFor: 'All farm types; ideal for farmers transitioning from chemical to organic',
  },
  {
    id: 'natural', name: 'Zero Budget Natural Farming', icon: '☀️', color: '#795548',
    description: 'Zero-budget natural farming using locally available resources like cow dung, urine, and plant-based preparations. Based on Subhash Palekar\'s methods.',
    benefits: ['Minimal to zero input costs', 'Complete self-sufficiency', 'Best for soil health', 'Government support under ZBNF program'],
    challenges: ['Requires significant knowledge', 'Gradual yield improvement needed', 'More labor intensive'],
    suitableFor: 'Small and marginal farmers; farmers with access to desi cow',
  },
];

export default function FarmingMethod() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string>(() =>
    localStorage.getItem('farmingMethod') || ''
  );
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('farmingMethod', selected);
    setSaved(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚜 {t.farmingMethodTitle}</h1>
        <p>{t.farmingMethodSubtitle}</p>
      </div>

      <div className="method-cards">
        {METHODS.map(method => (
          <div
            key={method.id}
            className={`method-card ${selected === method.id ? 'selected' : ''}`}
            style={{ borderColor: selected === method.id ? method.color : undefined }}
          >
            <div className="method-header" onClick={() => handleSelect(method.id)}>
              <div className="method-icon" style={{ background: method.color }}>
                {method.icon}
              </div>
              <div className="method-info">
                <div className="method-title-row">
                  <h3>{method.name}</h3>
                  {selected === method.id && <span className="selected-badge">✅ Selected</span>}
                </div>
                <p>{method.description}</p>
                <small>💡 Best for: {method.suitableFor}</small>
              </div>
              <button
                className="expand-btn"
                onClick={e => { e.stopPropagation(); setExpanded(expanded === method.id ? null : method.id); }}
              >
                {expanded === method.id ? '▲' : '▼'}
              </button>
            </div>

            {expanded === method.id && (
              <div className="method-details">
                <div className="method-detail-col">
                  <h4>✅ Benefits</h4>
                  <ul>
                    {method.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
                <div className="method-detail-col">
                  <h4>⚠️ Challenges</h4>
                  <ul>
                    {method.challenges.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            )}

            <div className="method-footer">
              <button
                className={`btn ${selected === method.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleSelect(method.id)}
              >
                {selected === method.id ? '✅ Selected' : 'Select This Method'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="save-bar">
          <button className="btn btn-primary btn-large" onClick={handleSave}>
            {saved ? '✅ Method Saved!' : `💾 ${t.saveMethod}`}
          </button>
        </div>
      )}
    </div>
  );
}
