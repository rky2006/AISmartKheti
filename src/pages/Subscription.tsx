import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, TRIAL_DAYS } from '../hooks/useSubscription';

type PayStep = 'idle' | 'confirm' | 'processing' | 'done';

export default function Subscription() {
  const { t } = useLanguage();
  const { user, subscribe } = useAuth();
  const { isTrialActive, isSubscribed, daysLeftInTrial, subscriptionExpiry } = useSubscription();
  const navigate = useNavigate();
  const [step, setStep] = useState<PayStep>('idle');
  const [paidExpiry, setPaidExpiry] = useState<number | null>(null);

  const handlePay = async () => {
    setStep('processing');
    // Simulate payment gateway delay
    await new Promise(r => setTimeout(r, 2000));
    subscribe();
    setPaidExpiry(Date.now() + 365 * 24 * 60 * 60 * 1000);
    setStep('done');
  };

  const handleDone = () => {
    navigate('/dashboard');
  };

  const formatDate = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  if (!user) return null;

  return (
    <div className="subscription-page">
      {/* Header */}
      <div className="subscription-header">
        <div className="sub-logo">🌱</div>
        <h1 className="sub-title">{t.appName}</h1>
        <p className="sub-tagline">{t.subscriptionTagline}</p>
      </div>

      {/* Pricing Plan Card */}
      <div className="sub-plan-card">
        <div className="sub-plan-badge">🎉 {t.bestValue}</div>
        <h2 className="sub-plan-name">{t.farmerPlan}</h2>
        <div className="sub-plan-price">
          <span className="sub-price-free">{t.freeTrialDays.replace('{days}', TRIAL_DAYS.toString())}</span>
          <span className="sub-price-then">{t.thenAfterTrial}</span>
          <div className="sub-price-main">
            <span className="sub-rupee">₹</span>
            <span className="sub-amount">50</span>
            <span className="sub-period">/{t.perYear}</span>
          </div>
          <span className="sub-price-note">{t.aboutPerMonth}</span>
        </div>
        <ul className="sub-features">
          <li>✅ {t.feature1}</li>
          <li>✅ {t.feature2}</li>
          <li>✅ {t.feature3}</li>
          <li>✅ {t.feature4}</li>
          <li>✅ {t.feature5}</li>
          <li>✅ {t.feature6}</li>
        </ul>
      </div>

      {/* Current Status Card */}
      <div className={`sub-status-card ${isSubscribed ? 'status-subscribed' : isTrialActive ? 'status-trial' : 'status-expired'}`}>
        {isSubscribed ? (
          <>
            <div className="sub-status-icon">⭐</div>
            <h3>{t.subscribed}</h3>
            <p>{t.subscribedUntil.replace('{date}', formatDate(subscriptionExpiry!))}</p>
          </>
        ) : isTrialActive ? (
          <>
            <div className="sub-status-icon">{daysLeftInTrial <= 7 ? '⚠️' : '🕐'}</div>
            <h3>{t.trialActive}</h3>
            <p>
              {daysLeftInTrial <= 7
                ? t.trialExpiringSoon.replace('{days}', daysLeftInTrial.toString())
                : t.trialDaysLeft.replace('{days}', daysLeftInTrial.toString())}
            </p>
          </>
        ) : (
          <>
            <div className="sub-status-icon">🔒</div>
            <h3>{t.trialExpired}</h3>
            <p>{t.trialExpiredDesc}</p>
          </>
        )}
      </div>

      {/* Payment Section */}
      {!isSubscribed && (
        <div className="sub-payment-section">
          {step === 'idle' && (
            <>
              <p className="sub-pay-note">{t.payNote}</p>
              <button className="btn-subscribe" onClick={() => setStep('confirm')}>
                💳 {t.subscribeNow} — ₹50/{t.perYear}
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="sub-confirm-box">
              <h3>{t.confirmPayment}</h3>
              <div className="sub-confirm-amount">₹50 / {t.perYear}</div>
              <p>{t.confirmPaymentDesc}</p>
              <div className="sub-confirm-methods">
                <span className="payment-method">UPI</span>
                <span className="payment-method">Net Banking</span>
                <span className="payment-method">Debit Card</span>
              </div>
              <div className="sub-confirm-actions">
                <button className="btn-subscribe" onClick={handlePay}>
                  {t.payNow} ₹50
                </button>
                <button className="btn-sub-cancel" onClick={() => setStep('idle')}>
                  {t.cancel}
                </button>
              </div>
              <p className="sub-secure-note">🔒 {t.securePayment}</p>
            </div>
          )}

          {step === 'processing' && (
            <div className="sub-processing">
              <div className="sub-spinner" />
              <p>{t.processingPayment}</p>
            </div>
          )}

          {step === 'done' && (
            <div className="sub-success">
              <div className="sub-success-icon">✅</div>
              <h3>{t.paymentSuccess}</h3>
              <p>{t.paymentSuccessDesc.replace('{date}', formatDate(paidExpiry ?? 0))}</p>
              <button className="btn-subscribe" onClick={handleDone}>
                🏠 {t.goToDashboard}
              </button>
            </div>
          )}
        </div>
      )}

      {isSubscribed && (
        <div className="sub-payment-section">
          <button className="btn-subscribe btn-go-home" onClick={handleDone}>
            🏠 {t.goToDashboard}
          </button>
        </div>
      )}
    </div>
  );
}
