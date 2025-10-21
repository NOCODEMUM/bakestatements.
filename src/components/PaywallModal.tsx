import { X, Crown, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { STRIPE_PRICES } from '../lib/stripe';
import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, mode: string = 'subscription') => {
    if (!user) return;

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 my-8 max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Your free trial has ended. Upgrade to continue managing your bakery with BakeStatements.
          </p>
        </div>

        <div className="space-y-4 mb-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
          <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Monthly Plan</h3>
              <span className="text-2xl font-bold text-amber-500">$19</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">AUD per month</p>
            <ul className="space-y-2 text-sm">
              {[
                'Unlimited orders & recipes',
                'ATO-compliant expense tracking',
                'Professional invoicing',
                'CSV/PDF exports',
                'Email support'
              ].map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(STRIPE_PRICES.monthly, 'subscription')}
              disabled={loading === STRIPE_PRICES.monthly}
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors mt-4 font-medium disabled:opacity-50"
            >
              {loading === STRIPE_PRICES.monthly ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Choose Monthly'
              )}
            </button>
          </div>

          <div className="border-2 border-emerald-400 rounded-lg p-4 bg-emerald-50 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              BEST VALUE
            </div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h3 className="font-bold text-gray-800">Annual Plan</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-600">$180</span>
                <p className="text-xs text-gray-500 line-through">$228</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">AUD per year (Save $48!)</p>
            <button
              onClick={() => handleSubscribe(STRIPE_PRICES.annual, 'subscription')}
              disabled={loading === STRIPE_PRICES.annual}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading === STRIPE_PRICES.annual ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Choose Annual'
              )}
            </button>
          </div>

          <div className="border border-pink-200 rounded-lg p-4 bg-pink-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Founder's Lifetime</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-pink-600">$299</span>
                <p className="text-xs text-gray-500 line-through">$499</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">One-time payment • First 50 users only</p>
            <button
              onClick={() => handleSubscribe(STRIPE_PRICES.lifetime, 'payment')}
              disabled={loading === STRIPE_PRICES.lifetime}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading === STRIPE_PRICES.lifetime ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Get Lifetime Access'
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Choose your plan to continue using BakeStatements:
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
