import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

const mainFeatures = [
  {
    icon: '🌾',
    key: 'cropGuidance',
    path: '/crop-guidance',
    color: '#4caf50',
    bgColor: '#e8f5e9',
    description: 'Field Preparation · Sowing & Care · Harvest & Post-Harvest',
  },
  {
    icon: '🔬',
    key: 'cropHealth',
    path: '/crop-health',
    color: '#2196f3',
    bgColor: '#e3f2fd',
    description: 'Upload Crop Photo · AI Disease Detection & Treatment',
  },
  {
    icon: '🧪',
    key: 'soilWaterAnalysis',
    path: '/soil-water-analysis',
    color: '#ff9800',
    bgColor: '#fff3e0',
    description: 'Upload Soil & Water Report · Crop & Fertilizer Suggestions',
  },
  {
    icon: '💬',
    key: 'farmingAdvisory',
    path: '/advisory',
    color: '#607d8b',
    bgColor: '#eceff1',
    description: 'Expert Advice · AI Chat Support · Crop Solutions',
  },
  {
    icon: '🌿',
    key: 'organicFertilizers',
    path: '/organic-fertilizers',
    color: '#795548',
    bgColor: '#efebe9',
    description: 'Jeevamrut · Beejamrut · Panchagavya · Vermicompost',
  },
];

const freemiumServices = [
  { icon: '💡', label: 'Basic Tips', path: '/knowledge-base' },
  { icon: '👥', label: 'Community Forum', path: '/knowledge-base' },
  { icon: '⛅', label: 'Weather Updates', path: '/dashboard' },
];

const premiumServices = [
  { icon: '🔬', label: 'Advanced Disease Detection', path: '/crop-health' },
  { icon: '📊', label: 'Detailed Reports', path: '/soil-water-analysis' },
  { icon: '🏪', label: 'Agri Marketplace', path: '/market-prices' },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isTrialActive, isSubscribed, daysLeftInTrial } = useSubscription();

  return (
    <div className="page">
      {/* Trial / subscription banner */}
      {!isSubscribed && isTrialActive && (
        <div className={`trial-banner ${daysLeftInTrial <= 7 ? 'trial-banner-warning' : 'trial-banner-info'}`}>
          <span>
            {daysLeftInTrial <= 7
              ? `⚠️ ${t.trialExpiringSoon.replace('{days}', daysLeftInTrial.toString())}`
              : `🎉 ${t.trialDaysLeft.replace('{days}', daysLeftInTrial.toString())}`}
          </span>
          <Link to="/subscription" className="trial-banner-link">
            {t.subscribeNow} — ₹50/{t.perYear} →
          </Link>
        </div>
      )}

      {/* Header */}
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

      {/* Main 5-Feature Grid */}
      <section className="dashboard-section">
        <h2>🚀 Main Features</h2>
        <div className="main-features-grid">
          {mainFeatures.map(feature => (
            <Link
              key={feature.key}
              to={feature.path}
              className="main-feature-card"
              style={{ borderTopColor: feature.color }}
            >
              <div className="main-feature-icon" style={{ background: feature.bgColor, color: feature.color }}>
                {feature.icon}
              </div>
              <div className="main-feature-content">
                <h3 style={{ color: feature.color }}>{t[feature.key as keyof typeof t] as string}</h3>
                <p>{feature.description}</p>
              </div>
              <span className="main-feature-arrow" style={{ color: feature.color }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Freemium & Premium Services */}
      <section className="dashboard-section">
        <div className="service-tiers">
          {/* Freemium */}
          <div className="service-tier freemium-tier">
            <div className="tier-header freemium-header">
              <span>🆓</span>
              <h3>{t.freemiumTitle}</h3>
            </div>
            <ul className="tier-list">
              {freemiumServices.map(s => (
                <li key={s.label}>
                  <Link to={s.path}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="service-tier premium-tier">
            <div className="tier-header premium-header">
              <span>⭐</span>
              <h3>{t.premiumTitle}</h3>
              {!isSubscribed && (
                <Link to="/subscription" className="upgrade-badge">{t.upgradeNow}</Link>
              )}
            </div>
            <ul className="tier-list">
              {premiumServices.map(s => (
                <li key={s.label} className={!isSubscribed ? 'locked' : ''}>
                  {isSubscribed ? (
                    <Link to={s.path}>
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </Link>
                  ) : (
                    <span>
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                      <span className="lock-icon">🔒</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
