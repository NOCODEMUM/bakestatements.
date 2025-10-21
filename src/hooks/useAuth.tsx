import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface UserProfile {
  id: string;
  email: string;
  business_name?: string;
  phone_number?: string;
  abn?: string;
  trial_end_date: string;
  subscription_status: string;
  subscription_tier?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, businessName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  updateProfile: (data: any) => Promise<void>;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const { user: profile } = await api.auth.getProfile();
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const checkTrialStatus = (userData: UserProfile) => {
    const trialEnd = new Date(userData.trial_end_date);
    const now = new Date();
    const trialExpired = now > trialEnd;
    const activeSubscription = userData.subscription_status === 'active' || userData.subscription_status === 'lifetime';

    setIsTrialExpired(trialExpired && !activeSubscription);
    setHasActiveSubscription(activeSubscription);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        setAccessToken(token);
        try {
          const profile = await fetchUserProfile();
          if (profile) {
            setUser(profile);
            checkTrialStatus(profile);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, businessName?: string) => {
    try {
      const data = await api.auth.register(email, password, businessName);

      const token = localStorage.getItem('accessToken');
      setAccessToken(token);

      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);

      const token = localStorage.getItem('accessToken');
      setAccessToken(token);

      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signOut = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsTrialExpired(false);
      setHasActiveSubscription(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      await api.auth.updateProfile(data);

      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isTrialExpired,
        hasActiveSubscription,
        updateProfile,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
