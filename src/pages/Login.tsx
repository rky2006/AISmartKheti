import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', state: 'Maharashtra', avatar: '👨‍🌾' },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', state: 'Punjab', avatar: '👩‍🌾' },
  { name: 'Amit Patel', email: 'amit.patel@gmail.com', state: 'Gujarat', avatar: '🧑‍🌾' },
];

export default function Login() {
  const { t } = useLanguage();
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleGoogleSignIn = async (accountIndex = 0) => {
    setShowPicker(false);
    setLoading(true);
    await googleSignIn(accountIndex);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🌱</span>
          <h1>{t.appName}</h1>
          <p className="auth-tagline">{t.tagline}</p>
        </div>

        <h2>{t.signInWithGoogle}</h2>
        <p className="auth-subtitle">{t.googleSignInSubtitle}</p>

        {!showPicker ? (
          <button
            className="btn-google"
            onClick={() => setShowPicker(true)}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.4 33.7 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.3 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20-7.9 20-21 0-1.4-.1-2.7-.5-4z"/>
              <path fill="#34A853" d="M6.3 14.7l6.9 5.1C15 16.5 19.2 13 24 13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.3 29.5 3 24 3 16.2 3 9.4 7.9 6.3 14.7z"/>
              <path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.8 14.3-5l-6.6-5.4C29.6 36.1 27 37 24 37c-5.9 0-10.3-3.3-11.7-8.5L5.4 34c3.1 6.8 9.9 11 18.6 11z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C42.2 36.1 45 30.5 45 24c0-1.4-.1-2.7-.5-4z"/>
            </svg>
            {loading ? t.loading : t.signInWithGoogle}
          </button>
        ) : (
          <div className="google-account-picker">
            <p className="picker-title">Choose an account</p>
            {DEMO_ACCOUNTS.map((account, i) => (
              <button
                key={account.email}
                className="google-account-option"
                onClick={() => handleGoogleSignIn(i)}
              >
                <span className="account-avatar">{account.avatar}</span>
                <div className="account-info">
                  <span className="account-name">{account.name}</span>
                  <span className="account-email">{account.email}</span>
                  <span className="account-state">{account.state}</span>
                </div>
                <span className="account-arrow">›</span>
              </button>
            ))}
            <button className="btn btn-outline btn-sm picker-cancel" onClick={() => setShowPicker(false)}>
              Cancel
            </button>
          </div>
        )}

        <div className="auth-divider">
          <span>Demo app — no real Google account needed</span>
        </div>
        <p className="demo-hint">🔒 Simulated Google Sign-In for demonstration</p>
      </div>
    </div>
  );
}
