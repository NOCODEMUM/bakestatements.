import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { auth } from '../lib/firebase'
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth'

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signUp: (email: string, password: string, options?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  isTrialExpired: boolean
  hasActiveSubscription: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  useEffect(() => {
    // Listen for Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        await fetchOrCreateProfile(firebaseUser)
      } else {
        setProfile(null)
        setIsTrialExpired(false)
        setHasActiveSubscription(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fetchOrCreateProfile = async (firebaseUser: User) => {
    try {
      // Try to find existing profile by firebase_uid
      let { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single()

      if (!existingProfile) {
        // Create new profile for Firebase user
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert([{
            id: crypto.randomUUID(),
            email: firebaseUser.email!,
            firebase_uid: firebaseUser.uid,
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            subscription_status: 'trial'
          }])
          .select()
          .single()

        if (error) throw error
        existingProfile = newProfile
      }

      setProfile(existingProfile)
      checkTrialStatus(existingProfile)
    } catch (error) {
      console.error('Error fetching/creating profile:', error)
    }
  }

  const checkTrialStatus = async (profile: any) => {
    if (!profile) return
    
    const trialEnd = new Date(profile.trial_end_date)
    const now = new Date()
    const trialExpired = now > trialEnd
    const activeSubscription = ['active', 'lifetime'].includes(profile.subscription_status)
    
    setIsTrialExpired(trialExpired && !activeSubscription)
    setHasActiveSubscription(activeSubscription)
  }

  const signUp = async (email: string, password: string, options?: any) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result
  }

  const signOut = async () => {
    const result = await firebaseSignOut(auth)
    return result
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      isTrialExpired,
      hasActiveSubscription
    }}>
      {children}
    </AuthContext.Provider>
  )
}
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

  const signUp = async (email: string, password: string, options?: any) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth?message=email_verified`
      }
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
      isTrialExpired,
      hasActiveSubscription
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