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
  full_name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPasswordForEmail: (email: string) => Promise<any>;
  updateUserPassword: (password: string, accessToken: string, refreshToken: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

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

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    // If sign up successful and user created, update profile with full name
    if (result.data.user && fullName) {
      try {
        await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', result.data.user.id)
      } catch (error) {
        console.error('Error updating profile with full name:', error)
      }
    }

    return result
  }

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

  const resetPasswordForEmail = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return result
  }

  const updateUserPassword = async (password: string, accessToken: string, refreshToken: string) => {
    // Set the session with the tokens from the reset link
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError) throw sessionError

    // Update the password
    const result = await supabase.auth.updateUser({
      password: password
    })

    // Sign out after password update to force fresh login
    await supabase.auth.signOut()

    return result
  }

  const resendVerification = async (email: string) => {
    const result = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    return result
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        resendVerification,
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
