import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Commodity {
  name: string;
  current: number;
  yesterday: number;
  weeklyChange: number;
  market: string;
  state: string;
  unit: string;
  history: number[];
}

const COMMODITIES: Commodity[] = [
  { name: 'Wheat', current: 2185, yesterday: 2170, weeklyChange: 1.2, market: 'Pune APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [2100, 2120, 2145, 2160, 2170, 2180, 2185] },
  { name: 'Rice (Common)', current: 2250, yesterday: 2260, weeklyChange: -0.8, market: 'Mumbai APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [2300, 2280, 2260, 2250, 2260, 2255, 2250] },
  { name: 'Maize', current: 1890, yesterday: 1875, weeklyChange: 2.1, market: 'Nagpur APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [1800, 1820, 1840, 1860, 1875, 1885, 1890] },
  { name: 'Soybean', current: 4500, yesterday: 4480, weeklyChange: 0.9, market: 'Indore APMC', state: 'Madhya Pradesh', unit: '₹/Quintal', history: [4400, 4420, 4440, 4460, 4480, 4490, 4500] },
  { name: 'Onion', current: 1200, yesterday: 1350, weeklyChange: -8.5, market: 'Nashik APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [1100, 1250, 1400, 1500, 1350, 1280, 1200] },
  { name: 'Tomato', current: 850, yesterday: 780, weeklyChange: 15.2, market: 'Pune APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [500, 600, 680, 730, 780, 810, 850] },
  { name: 'Cotton', current: 6800, yesterday: 6750, weeklyChange: 1.8, market: 'Akola APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [6600, 6650, 6700, 6720, 6750, 6780, 6800] },
  { name: 'Groundnut', current: 5600, yesterday: 5580, weeklyChange: 0.5, market: 'Jamnagar APMC', state: 'Gujarat', unit: '₹/Quintal', history: [5500, 5520, 5540, 5560, 5580, 5590, 5600] },
  { name: 'Sugarcane', current: 340, yesterday: 340, weeklyChange: 0, market: 'Kolhapur APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [340, 340, 340, 340, 340, 340, 340] },
  { name: 'Turmeric', current: 9500, yesterday: 9400, weeklyChange: 3.2, market: 'Sangli APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [8800, 9000, 9100, 9200, 9400, 9450, 9500] },
  { name: 'Wheat', current: 2210, yesterday: 2200, weeklyChange: 0.7, market: 'Ludhiana APMC', state: 'Punjab', unit: '₹/Quintal', history: [2150, 2165, 2175, 2185, 2200, 2205, 2210] },
  { name: 'Rice (Basmati)', current: 4800, yesterday: 4780, weeklyChange: 1.1, market: 'Amritsar APMC', state: 'Punjab', unit: '₹/Quintal', history: [4600, 4650, 4700, 4740, 4780, 4790, 4800] },
  { name: 'Potato', current: 1050, yesterday: 1080, weeklyChange: -2.4, market: 'Agra APMC', state: 'Uttar Pradesh', unit: '₹/Quintal', history: [1100, 1090, 1080, 1075, 1080, 1060, 1050] },
  { name: 'Mustard', current: 5200, yesterday: 5180, weeklyChange: 1.5, market: 'Jaipur APMC', state: 'Rajasthan', unit: '₹/Quintal', history: [5000, 5050, 5100, 5130, 5180, 5190, 5200] },
  { name: 'Chilli (Dry)', current: 12500, yesterday: 12200, weeklyChange: 4.8, market: 'Guntur APMC', state: 'Andhra Pradesh', unit: '₹/Quintal', history: [11000, 11500, 11800, 12000, 12200, 12350, 12500] },
  { name: 'Bajra (Pearl Millet)', current: 2050, yesterday: 2020, weeklyChange: 2.0, market: 'Jodhpur APMC', state: 'Rajasthan', unit: '₹/Quintal', history: [1950, 1970, 1990, 2010, 2020, 2035, 2050] },
  { name: 'Cotton', current: 6950, yesterday: 6900, weeklyChange: 1.3, market: 'Warangal APMC', state: 'Telangana', unit: '₹/Quintal', history: [6700, 6750, 6800, 6840, 6900, 6925, 6950] },
  { name: 'Sorghum (Jowar)', current: 2800, yesterday: 2780, weeklyChange: 1.0, market: 'Solapur APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [2700, 2720, 2740, 2760, 2780, 2790, 2800] },
  { name: 'Chickpea (Chana)', current: 5800, yesterday: 5750, weeklyChange: 1.3, market: 'Indore APMC', state: 'Madhya Pradesh', unit: '₹/Quintal', history: [5600, 5650, 5680, 5710, 5750, 5775, 5800] },
  { name: 'Pigeon Pea (Tur)', current: 7200, yesterday: 7100, weeklyChange: 2.8, market: 'Latur APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [6800, 6900, 6980, 7020, 7100, 7150, 7200] },
  { name: 'Banana', current: 1800, yesterday: 1820, weeklyChange: -0.9, market: 'Jalgaon APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [1900, 1880, 1860, 1840, 1820, 1810, 1800] },
  { name: 'Mango (Alphonso)', current: 8500, yesterday: 8200, weeklyChange: 5.1, market: 'Ratnagiri APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [7000, 7500, 7800, 8000, 8200, 8350, 8500] },
  { name: 'Grape', current: 5200, yesterday: 5100, weeklyChange: 3.0, market: 'Nashik APMC', state: 'Maharashtra', unit: '₹/Quintal', history: [4800, 4900, 4980, 5050, 5100, 5150, 5200] },
  { name: 'Garlic', current: 7800, yesterday: 7600, weeklyChange: 6.5, market: 'Ujjain APMC', state: 'Madhya Pradesh', unit: '₹/Quintal', history: [6500, 6800, 7000, 7200, 7600, 7700, 7800] },
  { name: 'Ginger', current: 12000, yesterday: 11800, weeklyChange: 3.8, market: 'Erode APMC', state: 'Tamil Nadu', unit: '₹/Quintal', history: [10500, 11000, 11300, 11600, 11800, 11900, 12000] },
  { name: 'Cumin (Jeera)', current: 24000, yesterday: 23500, weeklyChange: 2.7, market: 'Unjha APMC', state: 'Gujarat', unit: '₹/Quintal', history: [22000, 22500, 23000, 23200, 23500, 23750, 24000] },
  { name: 'Coriander', current: 7200, yesterday: 7100, weeklyChange: 1.8, market: 'Kota APMC', state: 'Rajasthan', unit: '₹/Quintal', history: [6800, 6900, 6950, 7000, 7100, 7150, 7200] },
  { name: 'Sunflower', current: 5100, yesterday: 5080, weeklyChange: 0.6, market: 'Bellary APMC', state: 'Karnataka', unit: '₹/Quintal', history: [4900, 4940, 4970, 5000, 5080, 5090, 5100] },
  { name: 'Ragi (Finger Millet)', current: 3200, yesterday: 3180, weeklyChange: 0.8, market: 'Tumkur APMC', state: 'Karnataka', unit: '₹/Quintal', history: [3050, 3080, 3110, 3140, 3180, 3190, 3200] },
  { name: 'Rice (Common)', current: 2180, yesterday: 2190, weeklyChange: -0.5, market: 'Thanjavur APMC', state: 'Tamil Nadu', unit: '₹/Quintal', history: [2220, 2210, 2200, 2195, 2190, 2185, 2180] },
];

const MARKETS_BY_STATE: Record<string, string[]> = COMMODITIES.reduce((acc, c) => {
  if (!acc[c.state]) acc[c.state] = [];
  if (!acc[c.state].includes(c.market)) acc[c.state].push(c.market);
  return acc;
}, {} as Record<string, string[]>);

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 100" className="mini-chart" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#4caf50' : '#f44336'}
        strokeWidth="3"
      />
    </svg>
  );
}

export default function MarketPrices() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterMarket, setFilterMarket] = useState('');

  const allStates = [...new Set(COMMODITIES.map(c => c.state))].sort();
  const marketsForState = filterState ? (MARKETS_BY_STATE[filterState] || []) : [];

  const handleStateFilter = (state: string) => {
    setFilterState(state);
    setFilterMarket('');
    setSelected(null);
  };

  const filtered = COMMODITIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchState = !filterState || c.state === filterState;
    const matchMarket = !filterMarket || c.market === filterMarket;
    return matchSearch && matchState && matchMarket;
  });

  const selectedCommodity = selected
    ? COMMODITIES.find(c => `${c.name}|${c.market}` === selected)
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 {t.marketPricesTitle}</h1>
        <p>{t.marketPricesSubtitle}</p>
        <div className="last-updated">🕐 {t.lastUpdated}: {new Date().toLocaleString()}</div>
      </div>

      <div className="market-filters">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null); }}
          placeholder={`🔍 Search commodities...`}
          className="search-input"
        />
        <select
          value={filterState}
          onChange={e => handleStateFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All States</option>
          {allStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterMarket}
          onChange={e => { setFilterMarket(e.target.value); setSelected(null); }}
          className="filter-select"
          disabled={!filterState}
        >
          <option value="">{filterState ? 'All APMC Markets' : 'Select state first'}</option>
          {marketsForState.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>{t.commodity}</th>
              <th>{t.currentPrice}</th>
              <th>{t.yesterdayPrice}</th>
              <th>{t.weeklyChange}</th>
              <th>State</th>
              <th>{t.market}</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const change = c.weeklyChange;
              const isUp = change >= 0;
              const key = `${c.name}|${c.market}`;
              return (
                <tr
                  key={key}
                  className={`price-row ${selected === key ? 'selected' : ''}`}
                  onClick={() => setSelected(selected === key ? null : key)}
                >
                  <td><strong>{c.name}</strong></td>
                  <td className="price-cell">₹{c.current.toLocaleString()}</td>
                  <td>₹{c.yesterday.toLocaleString()}</td>
                  <td className={isUp ? 'price-up' : 'price-down'}>
                    {isUp ? '▲' : '▼'} {Math.abs(change)}%
                  </td>
                  <td>{c.state}</td>
                  <td>{c.market}</td>
                  <td style={{ width: '80px' }}>
                    <MiniChart data={c.history} positive={isUp} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCommodity && (
        <div className="card price-detail">
          <h3>📈 {selectedCommodity.name} — {selectedCommodity.market} ({selectedCommodity.state}) — 7 Day Price History</h3>
          <div className="price-history">
            {['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', 'Yesterday', 'Today'].map((label, i) => (
              <div key={i} className="price-history-item">
                <span className="history-label">{label}</span>
                <div className="history-bar-wrapper">
                  <div
                    className="history-bar"
                    style={{
                      width: `${(selectedCommodity.history[i] / Math.max(...selectedCommodity.history)) * 100}%`,
                      background: i === 6 ? '#4caf50' : '#2196f3',
                    }}
                  ></div>
                </div>
                <span className="history-value">₹{selectedCommodity.history[i]}</span>
              </div>
            ))}
          </div>
          <div className="price-stats">
            <div className="stat-item">
              <span>Min (7d)</span>
              <strong>₹{Math.min(...selectedCommodity.history)}</strong>
            </div>
            <div className="stat-item">
              <span>Max (7d)</span>
              <strong>₹{Math.max(...selectedCommodity.history)}</strong>
            </div>
            <div className="stat-item">
              <span>Avg (7d)</span>
              <strong>₹{Math.round(selectedCommodity.history.reduce((a, b) => a + b, 0) / 7)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
