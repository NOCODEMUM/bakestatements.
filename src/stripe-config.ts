export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RyA4CHruLrtRCwi7inxZ3l2',
    name: 'BakeStatements.',
    description: 'Thanks so much for signing up for Bake Statements.',
    mode: 'payment',
    price: 299.00,
    currency: 'aud',
    currencySymbol: 'A$',
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}