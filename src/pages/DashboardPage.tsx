import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { LogOut, User, CreditCard, FileText, Calculator, DollarSign } from 'lucide-react';
import { getProductByPriceId } from '../stripe-config';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { subscription, loading } = useSubscription();

  const getSubscriptionStatus = () => {
    if (loading) return 'Loading...';
    if (!subscription) return 'No active subscription';
    
    const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;
    return product ? product.name : subscription.subscription_status || 'Active';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/20250820_0042_Koala Logo Design_remix_01k31cc4t3epsb1sqf7npt8hjb.png" 
                alt="BakeStatements Koala" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">BakeStatements</h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name || 'Baker'}! 👋
              </h2>
              <p className="text-gray-600">Ready to manage your bakery finances?</p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-pink-600" />
              <div>
                <p className="font-medium text-pink-900">Current Plan</p>
                <p className="text-pink-700">{getSubscriptionStatus()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Tracker</h3>
            <p className="text-gray-600 text-sm">Track all your bakery expenses with ATO-compliant categories.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Generator</h3>
            <p className="text-gray-600 text-sm">Create professional invoices with your ABN and branding.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Costing</h3>
            <p className="text-gray-600 text-sm">Calculate ingredient costs and set profitable pricing.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ATO Reports</h3>
            <p className="text-gray-600 text-sm">Generate tax-ready financial summaries with one click.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Add Expense</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Create Invoice</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors">
              <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Cost Recipe</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}