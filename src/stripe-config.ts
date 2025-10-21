export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
  interval?: string;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_Sty06g4MKX3Rib',
    priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY,
    name: 'Monthly Plan',
    description: 'Thanks so much for signing up for Bake Statements.',
    price: 19.00,
    currency: 'AUD',
    mode: 'subscription',
    interval: 'month'
  },
  {
    id: 'prod_TH620v7Gooh3dW',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL,
    name: 'Annual Plan',
    description: 'Thanks for signing up to BAKE STATEMENTS',
    price: 189.00,
    currency: 'AUD',
    mode: 'subscription',
    interval: 'year'
  },
  {
    id: 'prod_TH6zmJCwdahUr7',
    priceId: import.meta.env.VITE_STRIPE_PRICE_LIFETIME,
    name: 'Lifetime Access',
    description: 'One-time payment for unlimited access to BakeStatements',
    price: 299.00,
    currency: 'AUD',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(price);
};