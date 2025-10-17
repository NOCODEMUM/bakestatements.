import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  business_name?: string;
  phone_number?: string;
  abn?: string;
  trial_end_date: string;
  subscription_status: string;
  subscription_tier?: string;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string, businessName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bakestatements_access_token';
const REFRESH_TOKEN_KEY = 'bakestatements_refresh_token';
const USER_KEY = 'bakestatements_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedToken);
        setUser(parsedUser);
        checkTrialStatus(parsedUser);

        api.auth.getProfile(storedToken).then((response: any) => {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          checkTrialStatus(response.user);
        }).catch(() => {
          handleLogout();
        });
      } catch (error) {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const checkTrialStatus = (userData: User) => {
    const trialEnd = new Date(userData.trial_end_date);
    const now = new Date();
    const trialExpired = now > trialEnd;
    const activeSubscription = userData.subscription_status === 'active' || userData.subscription_status === 'lifetime';

    setIsTrialExpired(trialExpired && !activeSubscription);
    setHasActiveSubscription(activeSubscription);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setUser(null);
    setIsTrialExpired(false);
    setHasActiveSubscription(false);
  };

  const signUp = async (email: string, password: string, businessName?: string) => {
    try {
      const response: any = await api.auth.register(email, password, businessName);

      setAccessToken(response.accessToken);
      setUser(response.user);

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      checkTrialStatus(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response: any = await api.auth.login(email, password);

      setAccessToken(response.accessToken);
      setUser(response.user);

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      checkTrialStatus(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signOut = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await api.auth.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  const updateProfile = async (data: any) => {
    if (!accessToken) throw new Error('Not authenticated');

    try {
      const response: any = await api.auth.updateProfile(accessToken, data);
      setUser(response.user);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signUp,
        signIn,
        signOut,
        isTrialExpired,
        hasActiveSubscription,
        updateProfile,
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
