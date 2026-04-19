
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';

const navItems = [
  { path: '/dashboard', icon: '🏠', key: 'dashboard' },
  { path: '/crop-guidance', icon: '🌾', key: 'cropGuidance' },
  { path: '/crop-health', icon: '🔬', key: 'cropHealth' },
  { path: '/soil-water-analysis', icon: '🧪', key: 'soilWaterAnalysis' },
  { path: '/advisory', icon: '💬', key: 'farmingAdvisory' },
  { path: '/organic-fertilizers', icon: '🌿', key: 'organicFertilizers' },
  { path: '/market-prices', icon: '📊', key: 'marketPrices' },
  { path: '/knowledge-base', icon: '📚', key: 'knowledgeBase' },
  { path: '/activity-log', icon: '📝', key: 'activityLog' },
];

export default function Navbar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { isSubscribed, isTrialActive, daysLeftInTrial } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <span className="navbar-logo">🌱</span>
          <span className="navbar-title">{t.appName}</span>
        </Link>
        <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)}>
          ☰
        </button>
      </div>
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{t[item.key as keyof typeof t] as string}</span>
          </Link>
        ))}
        <div className="navbar-user">
          <div className="user-info">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.fullName} className="user-avatar" />
            ) : (
              <span className="user-name">👤 {user?.fullName}</span>
            )}
            {!user?.photoURL && <span className="user-name">{user?.fullName}</span>}
            {isSubscribed ? (
              <span className="sub-badge sub-badge-pro">⭐ PRO</span>
            ) : isTrialActive ? (
              <Link to="/subscription" className="sub-badge sub-badge-trial">
                🕐 {t.trial} {daysLeftInTrial}d
              </Link>
            ) : (
              <Link to="/subscription" className="sub-badge sub-badge-expired">
                🔒 {t.subscribe}
              </Link>
            )}
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
      </div>
    </nav>
  );
}
