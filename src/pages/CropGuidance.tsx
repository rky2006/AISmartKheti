import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type Tab = 'field' | 'sowing' | 'harvest';

interface GuidanceStep {
  title: string;
  icon: string;
  description: string;
  tips: string[];
}

const FIELD_PREPARATION: GuidanceStep[] = [
  {
    title: 'Soil Testing',
    icon: '🧪',
    description: 'Before preparing your field, always test the soil to understand its pH, nutrient content, and texture.',
    tips: [
      'Collect soil samples from 8–10 spots in the field at 15–20 cm depth',
      'Send samples to the nearest Krishi Vigyan Kendra or private soil lab',
      'Ideal soil pH for most crops: 6.0–7.5',
      'Test at least once every 3 years or before switching crops',
    ],
  },
  {
    title: 'Deep Ploughing',
    icon: '🚜',
    description: 'Deep ploughing breaks hardpan, improves aeration, and buries surface weeds and crop residues.',
    tips: [
      'Deep plough to 30–45 cm depth using a mouldboard plough once every 3–5 years',
      'Best done in summer (April–May) when soil is dry and hard',
      'Follow with 2–3 cross-ploughings with a cultivator or rotavator',
      'Leave ploughed soil exposed to sunlight to kill soil-borne pests',
    ],
  },
  {
    title: 'Soil Amendments',
    icon: '🌿',
    description: 'Add organic matter and nutrients to improve soil fertility before planting.',
    tips: [
      'Apply 5–10 tonnes/ha of well-decomposed FYM (farm yard manure) or compost',
      'Incorporate green manure (Dhaincha/Sunhemp) 4–6 weeks before planting',
      'Apply recommended fertilizers based on soil test report',
      'Add lime at 2–4 tonnes/ha if soil pH is below 6.0',
    ],
  },
  {
    title: 'Land Levelling & Bed Preparation',
    icon: '📐',
    description: 'Proper levelling ensures uniform water distribution and prevents waterlogging.',
    tips: [
      'Use a laser leveller for large fields to ensure uniform irrigation',
      'Create proper drainage channels (30 cm wide, 25 cm deep) every 10 m',
      'Prepare raised beds (15 cm high) for vegetables and horticulture crops',
      'In waterlogged areas, install subsurface drainage pipes before planting',
    ],
  },
];

const SOWING_CARE: GuidanceStep[] = [
  {
    title: 'Seed Selection & Treatment',
    icon: '🌱',
    description: 'High-quality, certified seeds treated against diseases ensure better germination and yield.',
    tips: [
      'Use certified seeds from government/reputed suppliers — never use farm-saved seeds of hybrid varieties',
      'Test germination: place 50 seeds on wet cloth, count germinated after 5 days (aim >85%)',
      'Treat seeds with Trichoderma viride @ 4g/kg seed for fungal protection',
      'Apply Beejamrut (cow-dung based solution) for organic seed treatment',
      'Soak seeds in water for 8–12 hours before sowing to improve germination',
    ],
  },
  {
    title: 'Sowing Time & Method',
    icon: '📅',
    description: 'Sow at the right time for your crop and region to maximize yield and quality.',
    tips: [
      'Kharif crops (Paddy, Maize, Cotton): Sow June–July with onset of monsoon',
      'Rabi crops (Wheat, Chickpea, Mustard): Sow October–November after kharif harvest',
      'Zaid crops (Vegetables, Watermelon): Sow February–March',
      'Maintain proper row spacing for air circulation and mechanized harvesting',
      'Use seed drill for uniform depth and spacing to reduce seed wastage by 20–25%',
    ],
  },
  {
    title: 'Irrigation Management',
    icon: '💧',
    description: 'Efficient irrigation prevents water stress and reduces waterlogging.',
    tips: [
      'Use drip irrigation to save 40–60% water compared to flood irrigation',
      'Critical irrigation stages: flowering and grain filling (never skip these)',
      'Irrigate in early morning or evening to minimize evaporation loss',
      'Check soil moisture by inserting finger 5 cm deep — irrigate if soil feels dry',
      'Maintain proper field channels to avoid waterlogging, which can cause root rot',
    ],
  },
  {
    title: 'Nutrient Management',
    icon: '🧬',
    description: 'Apply fertilizers at the right time and in the right amount for healthy crop growth.',
    tips: [
      'Apply 50% of nitrogen + full phosphorus + full potassium as basal dose at sowing',
      'Apply remaining 50% nitrogen in two equal splits: at tillering and panicle initiation',
      'Use Jeevamrut (200 L/acre) every 15 days as irrigation water for organic farming',
      'Foliar spray of 2% DAP solution at flowering improves grain/fruit quality',
      'Never mix urea with SSP — apply separately with 2–3 day gap',
    ],
  },
  {
    title: 'Weed & Pest Control',
    icon: '🐛',
    description: 'Timely control of weeds and pests prevents significant yield losses.',
    tips: [
      'First weeding at 20–25 days after sowing is most critical — do not delay',
      'Use pre-emergent herbicides (Pendimethalin 30 EC @ 3.3 L/ha) within 3 days of sowing',
      'Install yellow sticky traps (10/acre) to monitor and trap whitefly and aphids',
      'Use Neem oil 3% or NSKE 5% spray every 15 days for organic pest control',
      'Scout fields twice a week during vegetative stage for early pest detection',
    ],
  },
];

const HARVEST_POST_HARVEST: GuidanceStep[] = [
  {
    title: 'Harvesting at Right Maturity',
    icon: '🌾',
    description: 'Harvest at the correct crop maturity stage to maximize yield, quality, and storage life.',
    tips: [
      'Wheat/Rice: Harvest when 80–90% of grains turn golden; grain moisture 20–22%',
      'Vegetables: Harvest in early morning for maximum freshness and shelf life',
      'Fruits: Harvest when firm (not over-ripe) for better transport and storage',
      'Pulses: Harvest when 75–80% of pods turn yellow-brown',
      'Use mechanized harvester for large fields to reduce losses by 4–6%',
    ],
  },
  {
    title: 'Threshing & Cleaning',
    icon: '⚙️',
    description: 'Proper threshing and cleaning reduces grain damage and improves grain quality.',
    tips: [
      'Thresh within 2–3 days of harvest to prevent mold and field losses',
      'Use mechanical thresher instead of manual threshing to reduce grain damage',
      'Winnow on a windy day or use electric winnowing machine to remove chaff',
      'Clean grains thoroughly before storage to prevent pest infestation',
      'Dry grains to correct moisture (wheat 12%, rice 14%) before storage',
    ],
  },
  {
    title: 'Drying & Storage',
    icon: '🏚️',
    description: 'Proper drying and storage prevents 20–30% post-harvest losses.',
    tips: [
      'Sun-dry grains on clean tarpaulin sheets for 3–5 days to reduce moisture',
      'Test grain moisture with moisture meter before storage (target: 12–14%)',
      'Use hermetic storage bags (Zero-B/IRRI bags) to prevent insect damage without pesticides',
      'For large quantities: fumigate with Aluminium Phosphide @ 2 tablets/tonne in sealed storage',
      'Store in elevated structures to prevent moisture absorption from floor',
    ],
  },
  {
    title: 'Grading & Value Addition',
    icon: '📦',
    description: 'Grade and process produce to fetch better market prices.',
    tips: [
      'Grade produce by size and quality using grading machines for better prices',
      'Pack vegetables in perforated boxes/crates for better air circulation',
      'Wax coating extends shelf life of fruits (mango, citrus) by 15–20 days',
      'Consider value addition: flour milling, oil extraction, pickling, drying',
      'Register with FPO (Farmer Producer Organization) for collective marketing',
    ],
  },
  {
    title: 'Marketing & Selling',
    icon: '🏪',
    description: 'Sell your produce at the right time and place for maximum profit.',
    tips: [
      'Check e-NAM (National Agriculture Market) portal for best prices across APMCs',
      'Compare prices in 3–4 nearby mandis before selling',
      'If prices are low, use Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA) to sell at MSP',
      'Store during glut period and sell during off-season for 30–50% better prices',
      'Direct selling through Kisan Mandi, farmer markets to eliminate middlemen',
    ],
  },
];

export default function CropGuidance() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('field');
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'field', label: t.fieldPreparation, icon: '🌍' },
    { key: 'sowing', label: t.sowingCare, icon: '🌱' },
    { key: 'harvest', label: t.harvestPostHarvest, icon: '🌾' },
  ];

  const steps =
    activeTab === 'field' ? FIELD_PREPARATION :
    activeTab === 'sowing' ? SOWING_CARE :
    HARVEST_POST_HARVEST;

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌾 {t.cropGuidanceTitle}</h1>
        <p>{t.cropGuidanceSubtitle}</p>
      </div>

      <div className="tabs tabs-large">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab tab-large ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setExpandedStep(0); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="guidance-steps">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`guidance-card ${expandedStep === i ? 'expanded' : ''}`}
          >
            <button
              className="guidance-card-header"
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
            >
              <span className="guidance-icon">{step.icon}</span>
              <div className="guidance-title-group">
                <span className="guidance-step-num">Step {i + 1}</span>
                <h3>{step.title}</h3>
              </div>
              <span className="guidance-toggle">{expandedStep === i ? '▲' : '▼'}</span>
            </button>
            {expandedStep === i && (
              <div className="guidance-card-body">
                <p className="guidance-description">{step.description}</p>
                <ul className="guidance-tips">
                  {step.tips.map((tip, j) => (
                    <li key={j}>
                      <span className="tip-bullet">✅</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
