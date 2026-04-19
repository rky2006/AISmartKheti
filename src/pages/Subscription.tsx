import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, TRIAL_DAYS } from '../hooks/useSubscription';
import GooglePayButton from '../components/GooglePay/GooglePayButton';

type PayStep = 'idle' | 'processing' | 'done' | 'error';

export default function Subscription() {
  const { t } = useLanguage();
  const { user, subscribe } = useAuth();
  const { isTrialActive, isSubscribed, daysLeftInTrial, subscriptionExpiry } = useSubscription();
  const navigate = useNavigate();
  const [step, setStep] = useState<PayStep>('idle');
  const [paidExpiry, setPaidExpiry] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [gpayAvailable, setGpayAvailable] = useState<boolean | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGooglePaySuccess = (_paymentData: google.payments.api.PaymentData) => {
    setStep('processing');
    // In TEST mode the paymentData contains a test token.
    // In PRODUCTION, send paymentData.paymentMethodData.tokenizationData.token
    // to your backend / payment gateway for server-side charge completion.
    setTimeout(() => {
      subscribe();
      setPaidExpiry(Date.now() + 365 * 24 * 60 * 60 * 1000);
      setStep('done');
    }, 1500);
  };

  const handleGooglePayError = (err: Error | google.payments.api.PaymentsError) => {
    // If the error fired before onReadyToPayChange ever returned true, the
    // Google Pay script failed to load (e.g. blocked or offline) — treat it
    // like an unavailable browser and show the UPI/card fallback instead.
    if (gpayAvailable !== true) {
      setGpayAvailable(false);
      return;
    }
    // Otherwise a genuine payment failure: show the error state.
    const msg = err instanceof Error ? err.message : (err as google.payments.api.PaymentsError).statusMessage;
    setErrorMsg(msg || t.paymentError);
    setStep('error');
  };

  const handleFallbackPay = () => {
    setStep('processing');
    // Simulate non-Google-Pay payment processing
    setTimeout(() => {
      subscribe();
      setPaidExpiry(Date.now() + 365 * 24 * 60 * 60 * 1000);
      setStep('done');
    }, 2000);
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
            <div className="sub-pay-box">
              <div className="sub-pay-amount">
                <span className="sub-pay-amount-label">{t.amountDue}</span>
                <span className="sub-pay-amount-value">₹50 / {t.perYear}</span>
              </div>

              <p className="sub-pay-note">{t.payNote}</p>

              {/* Google Pay primary button */}
              <div className="gpay-section">
                <GooglePayButton
                  onSuccess={handleGooglePaySuccess}
                  onError={handleGooglePayError}
                  onReadyToPayChange={(available) => setGpayAvailable(available)}
                />
              </div>

              {/* Fallback for browsers where Google Pay is unavailable */}
              {gpayAvailable === false && (
                <div className="sub-fallback">
                  <p className="sub-fallback-note">{t.gpayNotAvailable}</p>
                  <div className="sub-confirm-methods">
                    <span className="payment-method">UPI</span>
                    <span className="payment-method">{t.netBanking}</span>
                    <span className="payment-method">{t.debitCard}</span>
                  </div>
                  <button className="btn-subscribe" onClick={handleFallbackPay}>
                    💳 {t.payNow} ₹50
                  </button>
                </div>
              )}

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

          {step === 'error' && (
            <div className="sub-error-box">
              <div className="sub-error-icon">❌</div>
              <p>{errorMsg}</p>
              <button className="btn-sub-cancel" onClick={() => setStep('idle')}>
                {t.tryAgain}
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
