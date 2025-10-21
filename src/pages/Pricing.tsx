import React from 'react';
import { PricingPlans } from '../components/PricingPlans';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { useAuth } from '../hooks/useAuth';

export const Pricing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Subscription</h2>
            <SubscriptionStatus />
          </div>
        )}
        
        <PricingPlans />
      </div>
    </div>
  );
};