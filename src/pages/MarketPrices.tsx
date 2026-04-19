import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Commodity {
  name: string;
  current: number;
  yesterday: number;
  weeklyChange: number;
  market: string;
  unit: string;
  history: number[];
}

const COMMODITIES: Commodity[] = [
  { name: 'Wheat', current: 2185, yesterday: 2170, weeklyChange: 1.2, market: 'Pune APMC', unit: '₹/Quintal', history: [2100, 2120, 2145, 2160, 2170, 2180, 2185] },
  { name: 'Rice (Common)', current: 2250, yesterday: 2260, weeklyChange: -0.8, market: 'Mumbai APMC', unit: '₹/Quintal', history: [2300, 2280, 2260, 2250, 2260, 2255, 2250] },
  { name: 'Maize', current: 1890, yesterday: 1875, weeklyChange: 2.1, market: 'Nagpur APMC', unit: '₹/Quintal', history: [1800, 1820, 1840, 1860, 1875, 1885, 1890] },
  { name: 'Soybean', current: 4500, yesterday: 4480, weeklyChange: 0.9, market: 'Indore APMC', unit: '₹/Quintal', history: [4400, 4420, 4440, 4460, 4480, 4490, 4500] },
  { name: 'Onion', current: 1200, yesterday: 1350, weeklyChange: -8.5, market: 'Nashik APMC', unit: '₹/Quintal', history: [1100, 1250, 1400, 1500, 1350, 1280, 1200] },
  { name: 'Tomato', current: 850, yesterday: 780, weeklyChange: 15.2, market: 'Pune APMC', unit: '₹/Quintal', history: [500, 600, 680, 730, 780, 810, 850] },
  { name: 'Cotton', current: 6800, yesterday: 6750, weeklyChange: 1.8, market: 'Akola APMC', unit: '₹/Quintal', history: [6600, 6650, 6700, 6720, 6750, 6780, 6800] },
  { name: 'Groundnut', current: 5600, yesterday: 5580, weeklyChange: 0.5, market: 'Jamnagar APMC', unit: '₹/Quintal', history: [5500, 5520, 5540, 5560, 5580, 5590, 5600] },
  { name: 'Sugarcane', current: 340, yesterday: 340, weeklyChange: 0, market: 'Kolhapur APMC', unit: '₹/Quintal', history: [340, 340, 340, 340, 340, 340, 340] },
  { name: 'Turmeric', current: 9500, yesterday: 9400, weeklyChange: 3.2, market: 'Sangli APMC', unit: '₹/Quintal', history: [8800, 9000, 9100, 9200, 9400, 9450, 9500] },
];

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

  const filtered = COMMODITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCommodity = COMMODITIES.find(c => c.name === selected);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 {t.marketPricesTitle}</h1>
        <p>{t.marketPricesSubtitle}</p>
        <div className="last-updated">🕐 {t.lastUpdated}: {new Date().toLocaleString()}</div>
      </div>

      <div className="search-bar">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`🔍 Search commodities...`}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>{t.commodity}</th>
              <th>{t.currentPrice}</th>
              <th>{t.yesterdayPrice}</th>
              <th>{t.weeklyChange}</th>
              <th>{t.market}</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const change = c.weeklyChange;
              const isUp = change >= 0;
              return (
                <tr
                  key={c.name}
                  className={`price-row ${selected === c.name ? 'selected' : ''}`}
                  onClick={() => setSelected(selected === c.name ? null : c.name)}
                >
                  <td><strong>{c.name}</strong></td>
                  <td className="price-cell">₹{c.current.toLocaleString()}</td>
                  <td>₹{c.yesterday.toLocaleString()}</td>
                  <td className={isUp ? 'price-up' : 'price-down'}>
                    {isUp ? '▲' : '▼'} {Math.abs(change)}%
                  </td>
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
          <h3>📈 {selectedCommodity.name} — 7 Day Price History</h3>
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
