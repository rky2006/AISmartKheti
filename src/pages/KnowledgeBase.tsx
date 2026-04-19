import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  tags: string[];
  content: string;
}

const ARTICLES: Article[] = [
  {
    id: 1, title: 'Integrated Nutrient Management for Higher Yields', category: 'Crop Management',
    readTime: 5, tags: ['fertilizer', 'nutrients', 'yield'],
    excerpt: 'Learn how to combine organic and inorganic fertilizers effectively to maximize crop yield while maintaining soil health.',
    content: `Integrated Nutrient Management (INM) involves combining organic and inorganic sources of plant nutrients to optimize crop production while maintaining soil health.

Key Principles:
1. Soil Testing: Always test soil before fertilizer application. This prevents over-application and saves costs.
2. Organic Matter: Add compost or FYM at 5–10 tonnes/ha to improve soil structure.
3. Balanced Fertilization: Apply NPK in the ratio recommended for your specific crop and soil type.
4. Split Application: Apply nitrogen in splits to reduce losses through leaching and volatilization.
5. Biofertilizers: Use Rhizobium for legumes and Azospirillum for non-legumes to fix atmospheric nitrogen.

Benefits:
- Reduced input costs by 20-30%
- Improved soil microbial activity
- Better water retention capacity
- Sustainable long-term soil health`,
  },
  {
    id: 2, title: 'Drip Irrigation: Save Water, Increase Yield', category: 'Water Management',
    readTime: 7, tags: ['irrigation', 'water saving', 'drip'],
    excerpt: 'Drip irrigation delivers water directly to plant roots, saving up to 60% water compared to flood irrigation.',
    content: `Drip irrigation is the most efficient irrigation method, delivering water directly to the root zone of plants.

Advantages:
- Water saving: 40-60% compared to flood irrigation
- Reduced weed growth (only crop area is wetted)
- Fertilizer can be applied through drip (fertigation)
- Suitable for all terrains including slopes

Installation Tips:
1. Use drip laterals spaced 60-90 cm apart for row crops
2. Install main filter unit at the pump head
3. Use pressure compensating emitters for uneven terrain
4. Flush laterals monthly to prevent clogging

Government Subsidy:
Under PM-KUSUM and PMKSY schemes, farmers can get 50-90% subsidy on drip installation. Contact your nearest Agriculture Department office.`,
  },
  {
    id: 3, title: 'Natural Pest Management Without Chemicals', category: 'Pest & Disease Management',
    readTime: 6, tags: ['IPM', 'bio-pesticides', 'organic'],
    excerpt: 'Use biological controls and cultural practices to manage pests without harmful chemical pesticides.',
    content: `Integrated Pest Management (IPM) uses multiple strategies to keep pest populations below economic threshold levels.

Biological Controls:
- Introduce Trichogramma wasps for stem borer control in rice
- Release Chrysoperla carnea (green lacewing) for aphid control
- Use Beauveria bassiana fungus for white grub management
- Encourage natural enemies: spiders, beetles, birds

Cultural Controls:
- Crop rotation to break pest cycles
- Use trap crops (e.g., marigold border around tomato)
- Sow resistant varieties
- Deep summer plowing to expose soil pests to sun

Organic Sprays:
- Neem oil (3%): effective against aphids, whiteflies, mites
- NSKE (Neem Seed Kernel Extract 5%): broad-spectrum pest control
- Garlic + chili extract: repellent for many pests
- Panchagavya: improves plant immunity`,
  },
  {
    id: 4, title: 'Soil pH and Its Impact on Crop Growth', category: 'Soil Health',
    readTime: 4, tags: ['soil', 'pH', 'lime', 'gypsum'],
    excerpt: 'Understanding soil pH helps you choose the right crops and amendments to maximize productivity.',
    content: `Soil pH affects nutrient availability and microbial activity. Most crops grow best between pH 6.0–7.5.

pH Ranges and Crops:
- Acidic (pH 5.5–6.5): Blueberry, potato, rice, tea
- Neutral (pH 6.5–7.5): Most vegetables, wheat, maize
- Alkaline (pH 7.5–8.5): Cotton, sugarcane (somewhat tolerant)

Correcting Soil pH:
For Acidic Soils:
- Apply agricultural lime (CaCO3) at 1–4 tonnes/ha
- Mix dolomite for calcium + magnesium
- Apply FYM and compost to buffer pH changes

For Alkaline Soils:
- Apply gypsum (CaSO4) at 2–5 tonnes/ha
- Use sulphur at 500 kg/ha
- Apply green manure and organic matter

Testing: Send soil samples to the nearest Soil Testing Laboratory for accurate pH measurement.`,
  },
  {
    id: 5, title: 'Post-Harvest Management to Reduce Losses', category: 'Post-Harvest',
    readTime: 5, tags: ['storage', 'post-harvest', 'grading'],
    excerpt: 'Proper post-harvest practices can prevent 20-40% of crop losses that occur after harvesting.',
    content: `Post-harvest losses account for 20-40% of total production in India. Proper management reduces these losses significantly.

Key Steps:
1. Timely Harvest: Harvest at physiological maturity to get maximum yield and quality
2. Proper Drying: Dry grains to safe moisture levels (12-14% for cereals)
3. Cleaning and Grading: Remove foreign matter and grade produce by size/quality
4. Storage:
   - Use hermetic bags for grain storage (no oxygen = no pests)
   - Maintain storage temperature below 25°C
   - Fumigate godowns with Aluminum Phosphide (by licensed operator)
5. Transportation: Use ventilated, clean vehicles; avoid compression damage

Market-Ready Produce:
- Wash, sort, and grade vegetables
- Use cold chain for perishables
- Pack in small consumer-friendly units for better prices
- Consider joining FPO (Farmer Producer Organization) for collective marketing`,
  },
  {
    id: 6, title: 'Organic Farming Certification Process in India', category: 'Organic Farming',
    readTime: 8, tags: ['organic', 'certification', 'PGS', 'NPOP'],
    excerpt: 'Step-by-step guide to getting organic certification for better prices and access to premium markets.',
    content: `Organic farming certification opens doors to premium markets and better prices. India has two main certification systems.

1. NPOP (National Program for Organic Production):
- For export markets
- Third-party certification by accredited agencies
- Takes 3 years conversion period
- Cost: Rs. 5,000–25,000/year

2. PGS-India (Participatory Guarantee System):
- For domestic markets
- Community-based peer certification
- Free or very low cost
- Faster approval (1 year conversion)

Steps to Get Certified:
1. Form a local group of 5+ farmers
2. Register on PGS-India portal (pgsindia-ncof.gov.in)
3. Prepare Organic System Plan (OSP)
4. Stop all prohibited inputs (synthetic fertilizers/pesticides)
5. Undergo peer inspection annually

Government Support:
- Paramparagat Krishi Vikas Yojana (PKVY): Rs. 50,000/ha over 3 years
- Contact: State Agriculture Department or NCOF (National Centre of Organic Farming)`,
  },
];

const CATEGORIES = ['All Categories', 'Crop Management', 'Soil Health', 'Water Management', 'Pest & Disease Management', 'Post-Harvest', 'Organic Farming'];

export default function KnowledgeBase() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = ARTICLES.filter(a =>
    (category === 'All Categories' || a.category === category) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(tag => tag.includes(search.toLowerCase())))
  );

  const categoryIcon: Record<string, string> = {
    'Crop Management': '🌾',
    'Soil Health': '🌍',
    'Water Management': '💧',
    'Pest & Disease Management': '🐛',
    'Post-Harvest': '📦',
    'Organic Farming': '🌿',
  };

  if (selectedArticle) {
    return (
      <div className="page">
        <button className="btn btn-outline" onClick={() => setSelectedArticle(null)}>
          ← {t.back}
        </button>
        <div className="article-full">
          <div className="article-meta">
            <span className="category-badge">{selectedArticle.category}</span>
            <span>{selectedArticle.readTime} {t.minRead}</span>
          </div>
          <h1>{selectedArticle.title}</h1>
          <div className="article-tags">
            {selectedArticle.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          <div className="article-content">
            {selectedArticle.content.split('\n').map((line, i) => {
              if (line.startsWith('##')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
              if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i}>{line.replace(/\*\*/g, '')}</h3>;
              if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
              if (line.match(/^\d+\./)) return <li key={i}>{line}</li>;
              if (!line.trim()) return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 {t.knowledgeBaseTitle}</h1>
        <p>{t.knowledgeBaseSubtitle}</p>
      </div>

      <div className="kb-controls">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`🔍 ${t.searchArticles}`}
          className="search-input"
        />
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat !== 'All Categories' && categoryIcon[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="articles-grid">
        {filtered.map(article => (
          <div key={article.id} className="article-card">
            <div className="article-category">
              {categoryIcon[article.category]} {article.category}
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div className="article-footer">
              <span>{article.readTime} {t.minRead}</span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedArticle(article)}
              >
                {t.readMore} →
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <span>📚</span>
            <p>No articles found for your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
