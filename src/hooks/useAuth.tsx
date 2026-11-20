'use client'; 
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'; 
 
type AuthContextType = { 
  user: any; 
  session: any; 
  isLoading: boolean; 
  isManager: boolean; 
  signIn: (email: string, password: string) => Promise<{ error: any }>; 
  signUp: (email: string, password: string,nom?: string) => Promise<{ error: any }>; 
  signOut: () => Promise<void>; 
  signInWithGoogle: () => Promise<{ error: any }>; 
  resetPassword: (email: string) => Promise<{ error: any }>; 
}; 
 
const AuthContext = createContext<AuthContextType | undefined>(undefined); 
 
export function AuthProvider({ children }: { children: ReactNode }) { 
  const [user, setUser] = useState<any>(null); 
  const [session, setSession] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true); 
 
  useEffect(() => { 
    const saved = localStorage.getItem('offline_user'); 
    if (saved) { 
      const u = JSON.parse(saved); 
      setUser(u); 
      setSession({ user: u }); 
    } 
    setIsLoading(false); 
  }, []); 
 
  const makeUser = (email: string) => { 
    const u = { id: '1', email: email }; 
    localStorage.setItem('offline_user', JSON.stringify(u)); 
    setUser(u); 
    setSession({ user: u }); 
    return { error: null }; 
  }; 
 
  const signIn = async (email: string, password: string,nom?:string) => { 
const users = JSON.parse(localStorage.getItem("mes_utilisateurs") || "[]"); 
const found = users.find((u: any) => u.email === email && u.password === password); 
if (!found) return { error: { message: "Email ou mot de passe incorrect" } }; 
return makeUser(email); 
}; 
const signUp = async (email: string, password: string,nom?: string) => { 
const users = JSON.parse(localStorage.getItem("mes_utilisateur") || "[]"); 
if (users.find((u: any) => u.email === email)) { 
return { error: { message: "Ce compte existe déjà" } }; 
} 
users.push({ email, password , nom:nom ||email}); 
localStorage.setItem("mes_utilisateurs", JSON.stringify(users)); 
return makeUser(email); 
};
  const signOut = async () => { 
    localStorage.removeItem('offline_user'); 
    setUser(null); 
    setSession(null); 
  }; 
  const signInWithGoogle = async () => { 
    return makeUser('test@gmail.com'); 
  }; 
  const resetPassword = async (email: string) => { 
    return { error: null }; 
  }; 
 
  return (  
    <AuthContext.Provider value={{ user, session, isLoading, isManager: true, signIn, signUp, 
signOut, signInWithGoogle, resetPassword }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
} 
 
export function useAuth() { 
  const context = useContext(AuthContext); 
  if (!context) throw new Error('useAuth must be used within AuthProvider'); 
  return context; 
}