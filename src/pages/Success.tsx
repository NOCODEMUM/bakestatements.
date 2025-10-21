import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading period to ensure payment processing is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600">
            Welcome to BakeStatements! Your subscription is now active and you have full access to all features.
          </p>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <p className="text-pink-800 text-sm">
            <strong>What's next?</strong> Start tracking your expenses, create professional invoices, and calculate recipe costs to grow your bakery business.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <Link
            to="/expenses"
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Start Tracking Expenses
          </Link>
        </div>

        {sessionId && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Session ID: {sessionId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};