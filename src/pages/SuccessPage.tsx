import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const { subscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Give some time for the webhook to process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <img 
              src="/20250820_0042_Koala Logo Design_remix_01k31cc4t3epsb1sqf7npt8hjb.png" 
              alt="BakeStatements Koala" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your purchase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Your payment has been processed successfully and you now have access to BakeStatements.
        </p>

        {subscription && (
          <div className="bg-pink-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-pink-800">
              <strong>Status:</strong> {subscription.subscription_status || 'Active'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          
          <Link
            to="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-500 mt-6">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}