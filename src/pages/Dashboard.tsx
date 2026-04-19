import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const quickActions = [
  { icon: '🔬', key: 'uploadCropPhoto', path: '/crop-health', color: '#e8f5e9' },
  { icon: '🌾', key: 'getAdvisory', path: '/advisory', color: '#e3f2fd' },
  { icon: '📊', key: 'checkPrices', path: '/market-prices', color: '#fff3e0' },
  { icon: '📝', key: 'logActivity', path: '/activity-log', color: '#fce4ec' },
];

const featureCards = [
  { icon: '🔬', key: 'cropHealth', path: '/crop-health', color: '#4caf50' },
  { icon: '🌾', key: 'farmingAdvisory', path: '/advisory', color: '#2196f3' },
  { icon: '📊', key: 'marketPrices', path: '/market-prices', color: '#ff9800' },
  { icon: '📚', key: 'knowledgeBase', path: '/knowledge-base', color: '#9c27b0' },
  { icon: '📝', key: 'activityLog', path: '/activity-log', color: '#f44336' },
  { icon: '🌱', key: 'cropType', path: '/crop-type', color: '#009688' },
  { icon: '🚜', key: 'farmingMethod', path: '/farming-method', color: '#795548' },
  { icon: '🌿', key: 'organicFertilizers', path: '/organic-fertilizers', color: '#8bc34a' },
  { icon: '🧪', key: 'soilWaterAnalysis', path: '/soil-water-analysis', color: '#00bcd4' },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header dashboard-header">
        <div>
          <h1>🌱 {t.welcomeBack}, {user?.fullName || 'Farmer'}!</h1>
          <p>{t.dashboardSubtitle}</p>
        </div>
        <div className="weather-widget">
          <span>☀️ 28°C</span>
          <span>💧 65% Humidity</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>{t.quickActions}</h2>
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <Link
              key={action.key}
              to={action.path}
              className="quick-action-card"
              style={{ background: action.color }}
            >
              <span className="qa-icon">{action.icon}</span>
              <span>{t[action.key as keyof typeof t] as string}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>All Features</h2>
        <div className="feature-grid">
          {featureCards.map(card => (
            <Link key={card.key} to={card.path} className="feature-card">
              <div className="feature-card-icon" style={{ background: card.color }}>
                {card.icon}
              </div>
              <span>{t[card.key as keyof typeof t] as string}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
