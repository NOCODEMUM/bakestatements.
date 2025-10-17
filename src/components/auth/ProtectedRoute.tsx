import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}