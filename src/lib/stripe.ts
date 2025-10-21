export const STRIPE_PAYMENT_LINKS = {
  monthly: import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY || '',
  annual: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL || '',
  lifetime: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LIFETIME || ''
};

export const redirectToStripePayment = (link: string) => {
  if (!link) {
    console.error('Stripe payment link is not configured');
    alert('Payment link not configured. Please contact support.');
    return;
  }

  window.location.replace(link);
};
