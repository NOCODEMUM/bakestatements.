import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Crown, AlertCircle } from 'lucide-react';

interface SubscriptionData {
  subscription_status: string | null;
  price_id: string | null;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (!subscription?.subscription_status) {
      return {
        text: 'BakeStatements Lifetime',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: Crown,
      };
    }

    switch (subscription.subscription_status) {
      case 'active':
        return {
          text: 'Active Subscription',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: Crown,
        };
      case 'trialing':
        return {
          text: 'Trial Period',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          icon: Crown,
        };
      case 'past_due':
      case 'unpaid':
        return {
          text: 'Payment Required',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: AlertCircle,
        };
      case 'canceled':
        return {
          text: 'Subscription Canceled',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: AlertCircle,
        };
      default:
        return {
          text: 'BakeStatements',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: Crown,
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className={`${status.bgColor} rounded-lg p-4 border`}>
      <div className="flex items-center">
        <StatusIcon className={`w-5 h-5 ${status.color} mr-2`} />
        <div>
          <p className={`font-medium ${status.color}`}>{status.text}</p>
          <p className="text-sm text-gray-600">Your current plan</p>
        </div>
      </div>
    </div>
  );
}