import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

// Demo user for testing without backend
const demoUser: User = {
  id: 1,
  name: 'Demo Admin',
  email: 'demo@example.com',
  role: 'ADMIN',
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role?: 'ADMIN' | 'CASHIER' }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with demo user - no auth required
  const [user, setUser] = useState<User | null>(demoUser);
  const [isLoading] = useState(false);

  // Demo login - just sets user without API call
  const login = async (_email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(demoUser);
  };

  // Demo register - just sets user without API call
  const register = async (data: { email: string; password: string; name: string; role?: 'ADMIN' | 'CASHIER' }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser({
      id: 1,
      name: data.name,
      email: data.email,
      role: data.role || 'CASHIER',
    });
  };

  const logout = () => {
    // For demo, just reset to demo user
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
