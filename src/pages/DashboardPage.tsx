import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus';
import { signOut } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calculator, FileText, DollarSign, Package } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: DollarSign,
      title: 'Expense Tracking',
      description: 'Track all your baking expenses with ATO-compliant categories',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FileText,
      title: 'Invoice Generator',
      description: 'Create professional invoices with your ABN and branding',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Calculator,
      title: 'Recipe Costing',
      description: 'Calculate the true cost of your recipes and set profitable prices',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Package,
      title: 'Equipment Library',
      description: 'Manage your baking equipment inventory with photos',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/bakestatements-logo.png" 
                alt="BakeStatements" 
                className="h-10 mr-3"
              />
              <span className="text-xl font-bold text-gray-900">BakeStatements</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to your BakeStatements dashboard. Manage your bakery finances with ease.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="mb-8">
          <SubscriptionStatus />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900 mb-1">Add Expense</h3>
              <p className="text-sm text-gray-600">Record a new business expense</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900 mb-1">Create Invoice</h3>
              <p className="text-sm text-gray-600">Generate a professional invoice</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900 mb-1">Cost Recipe</h3>
              <p className="text-sm text-gray-600">Calculate recipe profitability</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};