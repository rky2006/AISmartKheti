import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Fertilizer {
  id: string;
  name: string;
  icon: string;
  color: string;
  shortDesc: string;
  ingredients: { item: string; qty: string }[];
  steps: string[];
  benefits: string[];
  duration: string;
  quantity: string;
  applicationMethod: string;
}

const FERTILIZERS: Fertilizer[] = [
  {
    id: 'jeevamrut', name: 'Jeevamrut (Jivamrit)', icon: '🐄', color: '#4caf50',
    shortDesc: 'A fermented liquid bio-fertilizer that energizes soil microorganisms and provides essential nutrients.',
    ingredients: [
      { item: 'Desi cow dung (fresh)', qty: '10 kg' },
      { item: 'Desi cow urine (fresh)', qty: '10 litre' },
      { item: 'Jaggery (old)', qty: '1 kg' },
      { item: 'Flour (any grain — wheat, chickpea)', qty: '1 kg' },
      { item: 'Soil from banyan tree base / field bund', qty: '1 handful' },
      { item: 'Water (non-chlorinated)', qty: '200 litres' },
    ],
    steps: [
      'Take a 200-litre drum and fill it with 200 litres of water (non-chlorinated; let tap water sit 24 hours to de-chlorinate)',
      'Add 10 kg of fresh desi cow dung and mix well',
      'Add 10 litres of desi cow urine',
      'Add 1 kg of jaggery and mix thoroughly until dissolved',
      'Add 1 kg of flour (wheat, chickpea, or any grain flour)',
      'Add a handful of soil taken from under a banyan tree or from your field bund',
      'Mix all ingredients clockwise for 10 minutes',
      'Cover the drum with a jute sack (not airtight — fermentation needs air)',
      'Keep the drum in shade for 48 hours in summer, 72 hours in winter',
      'Stir twice daily (morning and evening) in clockwise direction',
      'After fermentation, strain through a cloth before use',
    ],
    benefits: [
      'Activates soil microorganisms (fungi, bacteria, earthworms)',
      'Improves soil structure and water retention',
      'Provides nitrogen, phosphorus, potassium naturally',
      'Suppresses harmful soil pathogens',
      'Improves seed germination rate by 20-30%',
      'Cost: virtually free (uses farm waste)',
    ],
    duration: '48–72 hours (fermentation)',
    quantity: '200 litres per batch',
    applicationMethod: 'Dilute 200 L Jeevamrut in 200 L water. Apply 400 L per acre through drip or flood irrigation. Alternatively, spray on soil around plants.',
  },
  {
    id: 'beejamrut', name: 'Beejamrut (Bijamrit)', icon: '🌱', color: '#8bc34a',
    shortDesc: 'A seed treatment solution that protects seeds from soil-borne and seed-borne diseases.',
    ingredients: [
      { item: 'Desi cow dung', qty: '5 kg' },
      { item: 'Desi cow urine', qty: '5 litre' },
      { item: 'Lime (calcium hydroxide)', qty: '50 grams' },
      { item: 'Water', qty: '20 litres' },
      { item: 'Soil from bund / banyan tree', qty: '1 handful' },
    ],
    steps: [
      'Take 20 litres of water in a container',
      'Dissolve 50 grams of lime in 1 litre of water, then add to the container',
      'Add 5 kg of fresh desi cow dung and mix well',
      'Add 5 litres of cow urine',
      'Add a handful of soil from under a banyan tree or bund',
      'Mix well and let it rest for 12 hours',
      'After 12 hours, strain the solution through cloth',
      'Soak seeds in this solution for 15-20 minutes before sowing',
      'Remove seeds, dry in shade for 30 minutes',
      'Sow seeds immediately while still moist (do not dry completely)',
    ],
    benefits: [
      'Protects seeds from soil-borne diseases (damping off, wilt)',
      'Improves germination percentage by 15-25%',
      'Provides initial nutrition to seedling',
      'Reduces seed-borne pathogens by 60-80%',
      'Natural alternative to chemical seed treatment fungicides',
      'Improves early root development',
    ],
    duration: '12 hours preparation + 15-20 min soak',
    quantity: '20 litres (sufficient for 1 acre seed treatment)',
    applicationMethod: 'Soak seeds for 15-20 minutes before sowing. For small seeds, coat with thick paste version of Beejamrut.',
  },
  {
    id: 'vermicompost', name: 'Vermicompost', icon: '🪱', color: '#795548',
    shortDesc: 'Nutrient-rich compost produced by earthworms feeding on organic waste materials.',
    ingredients: [
      { item: 'Earthworms (Eisenia fetida — Red Wigglers)', qty: '1-2 kg per sq meter' },
      { item: 'Farm waste (crop residues, vegetable waste)', qty: 'As available' },
      { item: 'Cow dung (partially decomposed)', qty: '25-30% of total volume' },
      { item: 'Dry leaves / straw', qty: 'For bedding (5-10 cm layer)' },
      { item: 'Water', qty: 'To maintain 40-50% moisture' },
    ],
    steps: [
      'Select a shaded, cool location (vermicompost bed should stay below 30°C)',
      'Prepare a bed: brick structure, wooden box, or earthen pit (1m wide × 0.3m deep × any length)',
      'Add 5-10 cm dry straw/leaves as bedding layer',
      'Add a layer of partially decomposed cow dung (2-3 cm)',
      'Release earthworms (1-2 kg/sq meter) on the bedding',
      'Add agricultural waste in thin layers (5-7 cm at a time)',
      'Maintain moisture at 40-50% (squeeze test: a few drops of water should come out)',
      'Cover bed with jute or shade net to maintain moisture and temperature',
      'Add new organic material every 3-5 days in thin layers',
      'Do NOT add meat, dairy, oily food — only plant-based waste',
      'Stir the top 5-10 cm gently every week to maintain aeration',
      'Vermicompost is ready in 45-60 days when it turns dark, crumbly, and earthy-smelling',
      'To harvest: stop watering and adding material for 2-3 days; worms will move down',
      'Collect top vermicompost layer; screen through 6mm mesh',
      'Store in shade; use within 6 months',
    ],
    benefits: [
      'Contains 5× more nitrogen than regular compost',
      'Contains 7× more phosphorus and 11× more potassium',
      'Improves soil aeration and water retention',
      'Contains beneficial microbes and enzymes',
      'Market value: ₹8-15 per kg (can be sold for income)',
      'Reduces need for chemical fertilizers by 30-40%',
      'Can be produced on-farm with agricultural waste',
    ],
    duration: '45–60 days per batch',
    quantity: 'Varies — typically 40-50% of input weight',
    applicationMethod: 'Apply 2-4 tonnes/acre as basal dose before planting. Mix into top 15 cm soil. Also use as potting mix (30% vermicompost + 70% soil). Can apply as top dressing around plants.',
  },
  {
    id: 'panchgavya', name: 'Panchgavya', icon: '🥛', color: '#ff9800',
    shortDesc: 'Ancient Indian preparation using five cow products that boosts plant immunity and growth.',
    ingredients: [
      { item: 'Fresh cow dung', qty: '3 kg' },
      { item: 'Cow ghee (clarified butter)', qty: '500 ml' },
      { item: 'Fresh cow urine', qty: '3 litres' },
      { item: 'Cow milk', qty: '2 litres' },
      { item: 'Curd from cow milk', qty: '2 litres' },
      { item: 'Ripe banana', qty: '12 fruits (crushed)' },
      { item: 'Coconut water', qty: '3 litres' },
      { item: 'Sugarcane juice / tender coconut water', qty: '3 litres' },
    ],
    steps: [
      'In a wide-mouthed earthen or plastic container (50 litre), add 3 kg cow dung',
      'Add 500 ml cow ghee to the dung and mix well; leave for 3 days while stirring twice daily',
      'On day 4, add 3 litres of fresh cow urine; mix and leave for 15 days',
      'Stir once daily in the morning (clockwise direction)',
      'After 15 days, add 3 litres cow milk, 2 litres curd, 3 litres coconut water',
      'Add 12 crushed ripe bananas and 3 litres sugarcane juice',
      'Mix all ingredients thoroughly',
      'Ferment for 7 more days, stirring once daily',
      'Total fermentation period: 22–25 days',
      'Keep container in shade; cover with cloth (not airtight)',
      'When ready, it will have a pleasant fermented aroma',
      'Strain through cotton cloth before use',
      'Store in shaded area; use within 6 months',
    ],
    benefits: [
      'Boosts plant immunity against diseases and stress',
      'Acts as growth promoter — increases yield by 15-25%',
      'Improves flowering and fruiting',
      'Can be used as seed treatment, soil drench, or foliar spray',
      'Contains amino acids, vitamins, and growth hormones',
      'Helps plants recover from drought and pest damage',
      'Completely organic and safe for all crops',
    ],
    duration: '22–25 days fermentation',
    quantity: 'Approx. 20 litres per batch',
    applicationMethod: 'Mix 3% Panchgavya in water (3 litres in 100 litres water). Apply as foliar spray every 15-20 days. For soil application: mix 10% in irrigation water. Best applied in morning or evening — avoid noon.',
  },
];

export default function OrganicFertilizers() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Fertilizer | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'benefits'>('ingredients');

  if (selected) {
    return (
      <div className="page">
        <button className="btn btn-outline" onClick={() => setSelected(null)}>← {t.back}</button>
        <div className="fertilizer-detail">
          <div className="fertilizer-detail-header" style={{ borderColor: selected.color }}>
            <span className="fertilizer-detail-icon">{selected.icon}</span>
            <div>
              <h1>{selected.name}</h1>
              <p>{selected.shortDesc}</p>
              <div className="fertilizer-meta">
                <span>⏱️ {t.duration}: <strong>{selected.duration}</strong></span>
                <span>📦 {t.quantity}: <strong>{selected.quantity}</strong></span>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>
              🧪 {t.ingredients}
            </button>
            <button className={`tab ${activeTab === 'steps' ? 'active' : ''}`} onClick={() => setActiveTab('steps')}>
              📋 {t.steps}
            </button>
            <button className={`tab ${activeTab === 'benefits' ? 'active' : ''}`} onClick={() => setActiveTab('benefits')}>
              ✅ {t.benefits}
            </button>
          </div>

          {activeTab === 'ingredients' && (
            <div className="tab-content">
              <table className="ingredients-table">
                <thead>
                  <tr><th>Ingredient</th><th>Quantity</th></tr>
                </thead>
                <tbody>
                  {selected.ingredients.map((ing, i) => (
                    <tr key={i}><td>{ing.item}</td><td><strong>{ing.qty}</strong></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="tab-content">
              <ol className="steps-list">
                {selected.steps.map((step, i) => (
                  <li key={i}><span className="step-num">{i + 1}</span>{step}</li>
                ))}
              </ol>
              <div className="application-box">
                <h4>🌾 Application Method</h4>
                <p>{selected.applicationMethod}</p>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="tab-content">
              <ul className="benefits-list">
                {selected.benefits.map((b, i) => (
                  <li key={i}>✅ {b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌿 {t.organicFertilizersTitle}</h1>
        <p>{t.organicFertilizersSubtitle}</p>
      </div>

      <div className="fertilizer-grid">
        {FERTILIZERS.map(fert => (
          <div
            key={fert.id}
            className="fertilizer-card"
            onClick={() => setSelected(fert)}
            style={{ borderTop: `4px solid ${fert.color}` }}
          >
            <div className="fertilizer-card-icon" style={{ background: fert.color }}>
              {fert.icon}
            </div>
            <h3>{fert.name}</h3>
            <p>{fert.shortDesc}</p>
            <div className="fertilizer-card-meta">
              <span>⏱️ {fert.duration}</span>
            </div>
            <button className="btn btn-outline btn-sm">{t.learnMore} →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
