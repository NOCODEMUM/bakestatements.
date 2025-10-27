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
  signUp: (email: string, password: string, businessName?: string) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        console.warn('No profile found for user:', userId);
        return null;
      }

      console.log('Profile fetched successfully:', { id: data.id, email: data.email });
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            checkTrialStatus(profile);
          } else {
            console.error('Failed to fetch profile for authenticated user:', session.user.id);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Has session' : 'No session');
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            checkTrialStatus(profile);
          } else {
            console.error('Failed to fetch profile after auth state change:', session.user.id);
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
    console.log('Attempting sign up for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }

    if (data.user) {
      const needsConfirmation = !data.session;
      console.log('User created, needs confirmation:', needsConfirmation);

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          business_name: businessName || null,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        if (!profileError.message.includes('duplicate key')) {
          throw new Error('Failed to create user profile. Please try again.');
        }
      } else {
        console.log('Profile created successfully');
      }

      if (data.session) {
        console.log('Session available, fetching profile...');
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
          checkTrialStatus(profile);
          console.log('Sign up complete, user logged in');
        }
      }

      return { needsConfirmation };
    }

    return { needsConfirmation: false };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }

    console.log('Sign in successful, fetching profile...');
    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile) {
        setUser(profile);
        checkTrialStatus(profile);
        console.log('Login complete, user state updated');
      } else {
        console.error('Profile not found after successful authentication');
        throw new Error('Profile not found. Please contact support.');
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

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      throw new Error(error.message);
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
        resendConfirmationEmail,
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
