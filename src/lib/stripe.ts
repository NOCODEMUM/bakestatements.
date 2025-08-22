import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_live_51HQu3YHruLrtRCwicQwk5bRfrvR38kdh5R73SmRBSQ12oKzMkkGjPVZ2ZbnSezrwiqjSX5ZHMvTKadLRio4Y4dX900XvrIf0N9')

export { stripePromise }

export const STRIPE_PRICES = {
  monthly: 'price_1RyA4CHruLrtRCwiXi8uqRWn',
  annual: 'price_1RyA4CHruLrtRCwiZJlqpEt1',
  lifetime: 'price_1RyA4CHruLrtRCwi7inxZ3l2'
}