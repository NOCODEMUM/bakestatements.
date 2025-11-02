export const STRIPE_PLANS = {
  monthly: 'monthly',
  annual: 'annual',
  lifetime: 'lifetime',
} as const;

export type StripePlanKey = keyof typeof STRIPE_PLANS;
