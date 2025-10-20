import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { STRIPE_PRICES, STRIPE_PAYMENT_LINKS } from '../lib/stripe';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, mode: string = 'subscription') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(priceId);

    try {
      const { url }: any = await api.stripe.createCheckout('', priceId, mode);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Something went wrong: ${error.message}. Please try again.`);
    } finally {
      setLoading(null);
    }
  };

  const features = [
    'Unlimited orders & recipes',
    'ATO-compliant expense tracking',
    'Professional invoicing',
    'Recipe costing calculator',
    'Equipment management',
    'Custom landing page',
    'CSV/PDF exports',
    'Email support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <PublicHeader />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start your 7-day free trial today. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h2>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-amber-600">$19</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (STRIPE_PAYMENT_LINKS.monthly) {
                  window.location.href = STRIPE_PAYMENT_LINKS.monthly;
                } else {
                  handleSubscribe(STRIPE_PRICES.monthly, 'subscription');
                }
              }}
              disabled={!STRIPE_PAYMENT_LINKS.monthly && loading === STRIPE_PRICES.monthly}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50"
            >
              {!STRIPE_PAYMENT_LINKS.monthly && loading === STRIPE_PRICES.monthly ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Start Monthly Plan'
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-500 p-8 flex flex-col relative transform md:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              MOST POPULAR
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Annual</h2>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-teal-600">$180</span>
                <span className="text-gray-600 ml-2">/year</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <span className="line-through">$228</span>
                <span className="text-pink-600 font-semibold ml-2">Save $48 compared to monthly!</span>
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(STRIPE_PRICES.annual, 'subscription')}
              disabled={loading === STRIPE_PRICES.annual}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading === STRIPE_PRICES.annual ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Start Annual Plan'
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 p-8 flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Founder's Lifetime</h2>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-pink-600">$299</span>
                <span className="text-gray-600 ml-2">once</span>
              </div>
              <p className="text-sm text-pink-600 font-semibold mt-2">
                Limited time - First 100 users only
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              <li className="flex items-start">
                <Check className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-semibold">Lifetime access - pay once, use forever</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(STRIPE_PRICES.lifetime, 'payment')}
              disabled={loading === STRIPE_PRICES.lifetime}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading === STRIPE_PRICES.lifetime ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Get Lifetime Access'
              )}
            </button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            All plans include a 7-day free trial
          </p>
          <p className="text-sm text-gray-500">
            30-day money-back guarantee • Cancel anytime
          </p>
          <p className="text-sm text-gray-500">
            All prices in AUD (Australian Dollars)
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
