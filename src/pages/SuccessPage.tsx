import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';

export function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for choosing BakeStatements. Your account has been activated 
            and you can now access all features.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What's Next?
            </h2>
            
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Start tracking your baking expenses
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Create professional invoices for your customers
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Calculate recipe costs and pricing
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Generate financial reports for tax time
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            
            <div>
              <Link
                to="/expenses"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Start tracking expenses →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}