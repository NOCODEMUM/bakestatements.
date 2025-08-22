import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, options?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  signInAsDemo: () => Promise<void>
  isTrialExpired: boolean
  hasActiveSubscription: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if demo mode is enabled in localStorage
    const demoMode = localStorage.getItem('demo_mode') === 'true'
    if (demoMode) {
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString()
      } as User
      
      const demoSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: demoUser
      } as Session
      
      setUser(demoUser)
      setSession(demoSession)
      setIsDemoMode(true)
      setIsTrialExpired(false)
      setHasActiveSubscription(true)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        checkTrialStatus(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          checkTrialStatus(session.user.id)
        } else {
          setIsTrialExpired(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkTrialStatus = async (userId: string) => {
    // Skip trial check for demo mode
    if (userId === 'demo-user-id') {
      setIsTrialExpired(false)
      setHasActiveSubscription(true)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_end_date, subscription_status')
      .eq('id', userId)
      .single()
    
    if (profile) {
      const trialEnd = new Date(profile.trial_end_date)
      const now = new Date()
      const trialExpired = now > trialEnd
      const activeSubscription = profile.subscription_status === 'active'
      
      setIsTrialExpired(trialExpired && !activeSubscription)
      setHasActiveSubscription(activeSubscription)
    }
  }

  const signInAsDemo = async () => {
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString()
    } as User
    
    const demoSession = {
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: demoUser
    } as Session
    
    setUser(demoUser)
    setSession(demoSession)
    setIsDemoMode(true)
    setIsTrialExpired(false)
    setHasActiveSubscription(true)
    
    // Store demo mode in localStorage
    localStorage.setItem('demo_mode', 'true')
  }
  const signUp = async (email: string, password: string, options?: any) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      ...options
    })
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return result
  }

  const signOut = async () => {
    // Clear demo mode
    if (isDemoMode) {
      localStorage.removeItem('demo_mode')
      setUser(null)
      setSession(null)
      setIsDemoMode(false)
      setIsTrialExpired(false)
      setHasActiveSubscription(false)
      return { error: null }
    }

    const result = await supabase.auth.signOut()
    return result
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      signInAsDemo,
      isTrialExpired,
      hasActiveSubscription,
      isDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}