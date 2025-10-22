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
    priceId: 'price_1SKYlHHruLrtRCwimG2HkGjV',
    name: 'BakeStatements - LIFELONG',
    description: 'One-time payment for lifetime access to BakeStatements',
    mode: 'payment',
    price: 299.00,
    currency: 'aud',
    currencySymbol: 'A$'
  },
  {
    priceId: 'price_1SKXpzHruLrtRCwiIdpYYkYO',
    name: 'BakeStatements - ANNUAL',
    description: 'Thanks for signing up to BAKE STATEMENTS',
    mode: 'subscription',
    price: 189.00,
    currency: 'aud',
    currencySymbol: 'A$'
  },
  {
    priceId: 'price_1RyA4CHruLrtRCwiXi8uqRWn',
    name: 'BakeStatements - MONTHLY',
    description: 'Thanks so much for signing up for Bake Statements.',
    mode: 'subscription',
    price: 19.00,
    currency: 'aud',
    currencySymbol: 'A$'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}