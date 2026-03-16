import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { authService, type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state lazily from localStorage to avoid setState in effect
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = authService.getUser();
    return storedUser || null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = authService.getToken();
    return storedToken || null;
  });
  const [loading] = useState(false);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { token: newToken, user: newUser } = response.data;

    authService.saveToken(newToken);
    authService.saveUser(newUser);

    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch {
        // Ignore logout errors
      }
    }
    authService.clearAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
