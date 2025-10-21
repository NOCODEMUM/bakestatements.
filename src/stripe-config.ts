export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RyA4CHruLrtRCwi7inxZ3l2',
    name: 'BakeStatements.',
    description: 'Thanks so much for signing up for Bake Statements.',
    mode: 'payment',
  },
];