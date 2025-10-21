export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RyA4CHruLrtRCwi7inxZ3l2',
    name: 'BakeStatements',
    description: 'Thanks so much for signing up for Bake Statements.',
    price: 299.00,
    currency: 'AUD',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};