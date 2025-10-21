import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import { Crown, Calendar, CreditCard } from 'lucide-react';

export const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading, plan } = useSubscription(user);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !plan) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <Crown className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">No Active Subscription</h3>
            <p className="text-yellow-700 mt-1">
              Subscribe to unlock all BakeStatements features
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing';
  const isLifetime = plan.mode === 'payment';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`rounded-lg shadow p-6 ${isActive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Crown className={`h-6 w-6 mr-3 ${isActive ? 'text-green-600' : 'text-red-600'}`} />
          <div>
            <h3 className={`text-lg font-medium ${isActive ? 'text-green-800' : 'text-red-800'}`}>
              {plan.name.replace('BakeStatements - ', '')} Plan
            </h3>
            <p className={`mt-1 ${isActive ? 'text-green-700' : 'text-red-700'}`}>
              {isLifetime ? 'Lifetime Access' : `Status: ${subscription.subscription_status}`}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {!isLifetime && subscription.current_period_end && (
        <div className="mt-4 flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-700">
            {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
            {formatDate(subscription.current_period_end)}
          </span>
        </div>
      )}

      {subscription.cancel_at_period_end && (
        <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">
              Your subscription will not renew and will expire on{' '}
              {subscription.current_period_end && formatDate(subscription.current_period_end)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};