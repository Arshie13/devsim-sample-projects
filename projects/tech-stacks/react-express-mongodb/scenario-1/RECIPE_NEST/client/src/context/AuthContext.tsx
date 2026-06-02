import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { fetchMe, login as loginApi, signup as signupApi } from "../services/auth.service";
import { setAuthToken } from "../services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (input: { name: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("rn_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    const result = await loginApi({ emailOrUsername, password });
    setAuthToken(result.token);
    setUser(result.user);
  }, []);

  const signup = useCallback(
    async (input: { name: string; username: string; email: string; password: string }) => {
      const result = await signupApi(input);
      setAuthToken(result.token);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
