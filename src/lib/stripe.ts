import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_live_51HQu3YHruLrtRCwicQwk5bRfrvR38kdh5R73SmRBSQ12oKzMkkGjPVZ2ZbnSezrwiqjSX5ZHMvTKadLRio4Y4dX900XvrIf0N9')

export { stripePromise }

export const STRIPE_PRICES = {
  monthly: 'price_monthly_plan_id', // Replace with actual Monthly Plan Price ID from Stripe Dashboard
  annual: 'price_annual_plan_id',   // Replace with actual Annual Plan Price ID from Stripe Dashboard  
  lifetime: 'price_lifetime_plan_id' // Replace with actual Lifetime Plan Price ID from Stripe Dashboard
}