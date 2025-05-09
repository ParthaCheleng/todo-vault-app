import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
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

// Check if using Supabase placeholder
const isUsingMock = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder-project') ?? false;


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 🔄 Sync user state on session change
  useEffect(() => {
    const syncUser = async () => {
      if (isUsingMock) {
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          setUser(JSON.parse(mockUser));
        }
        setLoading(false);
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error('Session fetch error:', error);

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      }

      setLoading(false);
    };

    syncUser();

    // ✅ Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
  }, []);

  // 📝 Sign Up
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (isUsingMock) {
        await new Promise((r) => setTimeout(r, 500));
        toast({ title: 'Success!', description: 'Mock signup complete' });
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      toast({
        title: 'Check your inbox!',
        description: 'Verification link sent to your email.',
      });
    } catch (err: any) {
      toast({
        title: 'Signup Failed',
        description: err?.message || 'Something went wrong.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Sign In
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (isUsingMock) {
        await new Promise((r) => setTimeout(r, 500));
        const mockUser = {
          id: 'mock-user-id',
          email,
          avatar_url: undefined,
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        toast({ title: 'Welcome back!', description: 'Mock login successful' });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast({ title: 'Welcome back!', description: 'Successfully signed in.' });
    } catch (err: any) {
      toast({
        title: 'Login Failed',
        description: err?.message || 'Invalid credentials.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Sign Out
  const signOut = async () => {
    try {
      setLoading(true);

      if (isUsingMock) {
        await new Promise((r) => setTimeout(r, 300));
        localStorage.removeItem('mockUser');
        setUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
    } catch (err: any) {
      toast({
        title: 'Logout Failed',
        description: err?.message || 'Unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔁 Hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
