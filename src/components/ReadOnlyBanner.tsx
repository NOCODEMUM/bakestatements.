import { Crown, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ReadOnlyBannerProps {
  onUpgradeClick: () => void;
}

export default function ReadOnlyBanner({ onUpgradeClick }: ReadOnlyBannerProps) {
  const { isReadOnlyMode, user } = useAuth();

  if (!isReadOnlyMode) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 relative z-50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-sm sm:text-base">Read-Only Mode</p>
              <p className="text-xs sm:text-sm text-blue-100">
                Your trial has ended. Viewing as {user?.email}. Upgrade to edit and create.
              </p>
            </div>
          </div>
          <button
            onClick={onUpgradeClick}
            className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
