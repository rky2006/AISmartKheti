import { useNavigate } from 'react-router-dom';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi' as Language, label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr' as Language, label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
];

export default function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="lang-select-page">
      <div className="lang-select-card">
        <div className="lang-select-logo">
          <span className="logo-icon">🌱</span>
          <h1>{t.appName}</h1>
          <p>{t.tagline}</p>
        </div>
        <h2>{t.selectLanguage}</h2>
        <div className="lang-options">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`lang-option ${language === lang.code ? 'selected' : ''}`}
              onClick={() => setLanguage(lang.code)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-native">{lang.nativeLabel}</span>
              <span className="lang-english">{lang.label}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
          {t.continueBtn} →
        </button>
      </div>
    </div>
  );
}
