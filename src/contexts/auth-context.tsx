
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're using the placeholder Supabase URL
const isUsingMock = supabase.supabaseUrl === 'https://placeholder-project.supabase.co';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      if (isUsingMock) {
        // Check localStorage for mock auth
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          setUser(JSON.parse(mockUser));
        }
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          avatar_url: data.session.user.user_metadata?.avatar_url,
        });
      }
      setLoading(false);
    };

    getSession();

    if (!isUsingMock) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isUsingMock) {
        // Mock signup - just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: "Success!",
          description: "Please check your email for verification",
        });
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Please check your email for verification",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isUsingMock) {
        // Mock signin
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock user
        const mockUser = {
          id: 'mock-user-id',
          email,
          avatar_url: undefined
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isUsingMock) {
        // Mock signout
        await new Promise(resolve => setTimeout(resolve, 300));
        localStorage.removeItem('mockUser');
        setUser(null);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
