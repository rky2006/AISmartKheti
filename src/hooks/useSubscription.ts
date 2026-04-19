import { useAuth } from '../contexts/AuthContext';

/** Free trial length in days */
export const TRIAL_DAYS = 90;

export interface SubscriptionStatus {
  /** True while the 90-day free trial is still running */
  isTrialActive: boolean;
  /** True when a paid annual subscription is active */
  isSubscribed: boolean;
  /** True when the user can use the app (trial OR subscribed) */
  hasAccess: boolean;
  /** Days remaining in the free trial (0 once expired) */
  daysLeftInTrial: number;
  /** Unix ms when the trial expires */
  trialExpiry: number;
  /** Unix ms when the paid subscription expires (undefined if not subscribed) */
  subscriptionExpiry: number | undefined;
}

export function useSubscription(): SubscriptionStatus {
  const { user } = useAuth();
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  // Fall back to "now" so a user without registeredAt still gets a fresh trial
  const registeredAt = user?.registeredAt ?? now;
  const trialExpiry = registeredAt + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const isTrialActive = now < trialExpiry;
  const isSubscribed = !!user?.subscriptionExpiry && now < user.subscriptionExpiry;
  const hasAccess = isTrialActive || isSubscribed;
  const daysLeftInTrial = Math.max(
    0,
    Math.ceil((trialExpiry - now) / (24 * 60 * 60 * 1000))
  );

  return {
    isTrialActive,
    isSubscribed,
    hasAccess,
    daysLeftInTrial,
    trialExpiry,
    subscriptionExpiry: user?.subscriptionExpiry,
  };
}
