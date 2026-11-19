"use client" 
import { createContext, useContext, useEffect, useState, ReactNode } from 'react' 
import { createClient } from '@/lib/supabase' 
import type { User, Session } from '@supabase/supabase-js' 
 
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isManager: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}; 
 
const AuthContext = createContext<AuthContextType | undefined>(undefined) 

 
export function AuthProvider({ children }: { children: ReactNode }) { 
  const supabase = createClient() 
  const [user, setUser] = useState<User | null>(null) 
  const [session, setSession] = useState<Session | null>(null) 
  const [isLoading, setIsLoading] = useState(true) 
  const [isManager, setIsManager] = useState(false) 
 
  useEffect(() => { 
    supabase.auth.getSession().then(({ data: { session:initialSession} }) =>
       { 
      setSession(initialSession) 
      setUser(initialSession?.user ?? null) 
      setIsLoading(false) 
    }) 
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => 
      { 
      setSession(newSession) 
      setUser(newSession?.user ?? null) 
      setIsLoading(false) 
    }) 
 
    return () => subscription.unsubscribe() 
  }, []) 
 
  const signUp = async (email: string, password: string) => { 
    const { error } = await supabase.auth.signUp({ email, password }) 
    return { error } 
  } 
 
  const signIn = async (email: string, password: string) => { 
    const { error } = await supabase.auth.signInWithPassword({ email, password }) 
    return { error } 
  }  
 
  const signOut = async () => { 
    await supabase.auth.signOut() 
    setUser(null) 
    setSession(null) 
  } 
 
  const signInWithGoogle = async () => { 
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${window.location.origin}/` } 
    }) 
  } 
 
  return ( 
    <AuthContext.Provider value={{ user, session, isLoading, isManager, signUp, signIn, 
signOut, signInWithGoogle }}> 
      {children} 
    </AuthContext.Provider> 
  ) 
} 
 
export function useAuth() { 
  const context = useContext(AuthContext) 
  if (!context) throw new Error("useAuth must be used within AuthProvider") 
  return context 
}