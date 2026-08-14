"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthStatus, AuthUser, LoginInput, SignupInput } from "./types";
import * as authService from "./auth-service";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          setStatus("unauthenticated");
          return;
        }

        try {
          const authUser = await authService.loadAuthUser(
            session.user.id,
            session.user.email ?? ""
          );
          setUser(authUser);
          setStatus("authenticated");
        } catch {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setStatus("loading");
    setError(null);
    try {
      const authUser = await authService.login(input);
      setUser(authUser);
      setStatus("authenticated");
    } catch (err) {
      setStatus("unauthenticated");
      setError(err instanceof Error ? err.message : "Login failed.");
      throw err;
    }
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    setStatus("loading");
    setError(null);
    try {
      const authUser = await authService.signup(input);
      setUser(authUser);
      setStatus("authenticated");
    } catch (err) {
      setStatus("unauthenticated");
      setError(err instanceof Error ? err.message : "Signup failed.");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ user, status, error, login, signup, logout, clearError }),
    [user, status, error, login, signup, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
