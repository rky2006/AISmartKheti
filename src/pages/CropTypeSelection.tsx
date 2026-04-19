import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CropCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  examples: string[];
  crops: string[];
}

const CROP_CATEGORIES: CropCategory[] = [
  {
    id: 'grain', name: 'Grain / Cereal Crops', icon: '🌾', description: 'Staple food crops, primary source of carbohydrates',
    examples: ['Wheat', 'Rice', 'Maize', 'Sorghum', 'Bajra'],
    crops: ['Wheat', 'Rice', 'Maize', 'Sorghum', 'Bajra (Pearl Millet)', 'Ragi (Finger Millet)', 'Barley', 'Oats'],
  },
  {
    id: 'horticulture', name: 'Horticulture', icon: '🍎', description: 'Fruit and ornamental crop cultivation',
    examples: ['Mango', 'Banana', 'Grape', 'Pomegranate'],
    crops: ['Mango', 'Banana', 'Grape', 'Pomegranate', 'Guava', 'Papaya', 'Orange', 'Lemon', 'Sapota', 'Custard Apple'],
  },
  {
    id: 'vegetables', name: 'Vegetables', icon: '🥦', description: 'Short-duration vegetable crops for daily nutrition',
    examples: ['Tomato', 'Onion', 'Potato', 'Brinjal'],
    crops: ['Tomato', 'Onion', 'Potato', 'Brinjal (Eggplant)', 'Okra (Bhendi)', 'Cabbage', 'Cauliflower', 'Bitter Gourd', 'Cucumber', 'Chilli'],
  },
  {
    id: 'oilseeds', name: 'Oilseeds', icon: '🌻', description: 'Crops grown primarily for oil extraction',
    examples: ['Soybean', 'Sunflower', 'Groundnut'],
    crops: ['Soybean', 'Sunflower', 'Groundnut', 'Mustard', 'Sesame (Til)', 'Linseed', 'Castor'],
  },
  {
    id: 'pulses', name: 'Pulses / Legumes', icon: '🫘', description: 'Protein-rich leguminous crops that fix atmospheric nitrogen',
    examples: ['Chickpea', 'Pigeon Pea', 'Lentil'],
    crops: ['Chickpea (Chana)', 'Pigeon Pea (Tur/Arhar)', 'Green Gram (Moong)', 'Black Gram (Urad)', 'Lentil (Masoor)', 'Cow Pea'],
  },
  {
    id: 'cash', name: 'Cash Crops', icon: '💰', description: 'High-value crops grown primarily for market',
    examples: ['Cotton', 'Sugarcane', 'Tobacco'],
    crops: ['Cotton', 'Sugarcane', 'Jute', 'Tobacco'],
  },
  {
    id: 'spices', name: 'Spices', icon: '🌶️', description: 'Aromatic crops used for flavoring',
    examples: ['Turmeric', 'Ginger', 'Cardamom'],
    crops: ['Turmeric', 'Ginger', 'Cardamom', 'Black Pepper', 'Coriander', 'Cumin (Jeera)', 'Fenugreek (Methi)'],
  },
  {
    id: 'forage', name: 'Forage / Fodder', icon: '🐄', description: 'Crops grown as feed for livestock',
    examples: ['Napier Grass', 'Berseem', 'Lucerne'],
    crops: ['Napier Grass', 'Berseem (Egyptian Clover)', 'Lucerne', 'Sudan Grass', 'Hybrid Napier', 'Stylosanthes'],
  },
];

export default function CropTypeSelection() {
  const { t } = useLanguage();
  const [selectedCrops, setSelectedCrops] = useState<string[]>(() => {
    const stored = localStorage.getItem('selectedCrops');
    return stored ? JSON.parse(stored) : [];
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
    setSaved(false);
  };

  const toggleCategory = (categoryId: string) => {
    const category = CROP_CATEGORIES.find(c => c.id === categoryId)!;
    const allSelected = category.crops.every(crop => selectedCrops.includes(crop));
    if (allSelected) {
      setSelectedCrops(prev => prev.filter(c => !category.crops.includes(c)));
    } else {
      setSelectedCrops(prev => [...new Set([...prev, ...category.crops])]);
    }
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('selectedCrops', JSON.stringify(selectedCrops));
    setSaved(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌱 {t.cropTypeTitle}</h1>
        <p>{t.cropTypeSubtitle}</p>
      </div>

      {selectedCrops.length > 0 && (
        <div className="selected-crops-bar">
          <h3>✅ {t.selectedCrops} ({selectedCrops.length})</h3>
          <div className="selected-tags">
            {selectedCrops.map(crop => (
              <span key={crop} className="selected-tag" onClick={() => toggleCrop(crop)}>
                {crop} ×
              </span>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? '✅ Saved!' : t.saveCrops}
          </button>
        </div>
      )}

      <div className="crop-categories">
        {CROP_CATEGORIES.map(cat => {
          const selected = cat.crops.filter(c => selectedCrops.includes(c));
          const isExpanded = expandedCategory === cat.id;
          return (
            <div key={cat.id} className="crop-category-card">
              <div className="crop-category-header" onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}>
                <div className="crop-cat-info">
                  <span className="crop-cat-icon">{cat.icon}</span>
                  <div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <small>Examples: {cat.examples.join(', ')}</small>
                  </div>
                </div>
                <div className="crop-cat-actions">
                  {selected.length > 0 && (
                    <span className="selection-count">{selected.length}/{cat.crops.length}</span>
                  )}
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={e => { e.stopPropagation(); toggleCategory(cat.id); }}
                  >
                    {cat.crops.every(c => selectedCrops.includes(c)) ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>
              {isExpanded && (
                <div className="crop-chips">
                  {cat.crops.map(crop => (
                    <button
                      key={crop}
                      className={`crop-chip ${selectedCrops.includes(crop) ? 'selected' : ''}`}
                      onClick={() => toggleCrop(crop)}
                    >
                      {selectedCrops.includes(crop) ? '✅' : '○'} {crop}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedCrops.length > 0 && (
        <div className="save-bar">
          <button className="btn btn-primary btn-large" onClick={handleSave}>
            {saved ? '✅ Saved Successfully!' : `💾 ${t.saveCrops}`}
          </button>
        </div>
      )}
    </div>
  );
}
