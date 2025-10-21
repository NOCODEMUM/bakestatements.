export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TH6zmJCwdahUr7',
    priceId: 'price_1SKYlHHruLrtRCwimG2HkGjV',
    name: 'BakeStatements - LIFELONG',
    description: 'One-time payment for lifetime access to BakeStatements',
    price: 299.00,
    currency: 'AUD',
    mode: 'payment'
  },
  {
    id: 'prod_TH620v7Gooh3dW',
    priceId: 'price_1SKXpzHruLrtRCwiIdpYYkYO',
    name: 'BakeStatements - ANNUAL',
    description: 'Thanks for signing up to BAKE STATEMENTS',
    price: 189.00,
    currency: 'AUD',
    mode: 'subscription'
  },
  {
    id: 'prod_Sty06g4MKX3Rib',
    priceId: 'price_1RyA4CHruLrtRCwiXi8uqRWn',
    name: 'BakeStatements - MONTHLY',
    description: 'Thanks so much for signing up for Bake Statements.',
    price: 19.00,
    currency: 'AUD',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};