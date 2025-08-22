import { loadStripe, Stripe } from '@stripe/stripe-js'

// Use test key for development, live key for production
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51HQu3YHruLrtRCwicQwk5bRfrvR38kdh5R73SmRBSQ12oKzMkkGjPVZ2ZbnSezrwiqjSX5ZHMvTKadLRio4Y4dX900XvrIf0N9'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
export { stripePromise }

export const STRIPE_PRICES = {
  monthly: 'price_1RyA4CHruLrtRCwiXi8uqRWn',
  annual: 'price_1RyA4CHruLrtRCwiZJlqpEt1',
  lifetime: 'price_1RyA4CHruLrtRCwi7inxZ3l2'
}