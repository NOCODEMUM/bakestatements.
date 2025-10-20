export const STRIPE_PRICES = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1RyA4CHruLrtRCwiXi8uqRWn',
  annual: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || 'price_1RyA4CHruLrtRCwiZJlqpEt1',
  lifetime: import.meta.env.VITE_STRIPE_PRICE_LIFETIME || 'price_1RyA4CHruLrtRCwi7inxZ3l2'
};

export const STRIPE_PAYMENT_LINKS = {
  monthly: import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY || '',
  annual: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL || '',
  lifetime: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LIFETIME || ''
};
