import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { getProductByPriceId, formatPrice } from '../stripe-config';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !subscription.subscription_status) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Free Trial</h3>
            <p className="text-sm text-yellow-700">
              You're currently on a free trial. Upgrade to continue using BakeStatements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;
  const isActive = subscription.subscription_status === 'active';
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isActive ? 'border-green-400' : 'border-red-400'
    }`}>
      <div className="flex items-center">
        {isActive ? (
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 mr-3" />
        )}
        <div>
          <h3 className={`text-sm font-medium ${
            isActive ? 'text-green-800' : 'text-red-800'
          }`}>
            {product?.name || 'Subscription'}
          </h3>
          <p className={`text-sm ${
            isActive ? 'text-green-700' : 'text-red-700'
          }`}>
            Status: {subscription.subscription_status}
            {product && (
              <span className="ml-2">• {formatPrice(product.price, product.currency)}</span>
            )}
          </p>
          {subscription.cancel_at_period_end && (
            <p className="text-sm text-orange-600 mt-1">
              Your subscription will end at the current period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};