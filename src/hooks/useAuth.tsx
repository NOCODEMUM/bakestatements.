import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, businessName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  isReadOnlyMode: boolean;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const isReadOnlyMode = isTrialExpired && !hasActiveSubscription;

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            checkTrialStatus(profile);
          }
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            checkTrialStatus(profile);
          }
        });
      } else {
        setUser(null);
        setIsTrialExpired(false);
        setHasActiveSubscription(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, businessName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          business_name: businessName || null,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      const profile = await fetchUserProfile(data.user.id);
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setIsTrialExpired(false);
    setHasActiveSubscription(false);
  };

  const updateProfile = async (data: any) => {
    if (!supabaseUser) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', supabaseUser.id);

    if (error) {
      throw new Error(error.message);
    }

    const profile = await fetchUserProfile(supabaseUser.id);
    if (profile) {
      setUser(profile);
      checkTrialStatus(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        signUp,
        signIn,
        signOut,
        isTrialExpired,
        hasActiveSubscription,
        isReadOnlyMode,
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
