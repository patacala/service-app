import React, { createContext, useEffect, useState, ReactNode, useContext, useCallback } from 'react';
import { SessionManager } from '@/infrastructure/session';
import { useRouter } from 'expo-router';
import { Profile } from '@/features/auth/store/auth.types';

interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}
type AuthContextType = {
  user: BackendUser | null;
  profile: Profile | null;
  loading: boolean;
  token: string | null;
  login: (backendToken: string, userData: BackendUser | null) => Promise<void>;
  userUpdate: (userData: BackendUser | null) => Promise<void>;
  profileUpdate: (profileData: Profile | null) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  token: null,
  login: async () => {},
  userUpdate: async () => {},
  profileUpdate: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<BackendUser | null>(null);
  const [sessionProfile, setSessionProfile] = useState<Profile | null>(null);

  const sessionManager = SessionManager.getInstance();
  const router = useRouter();

  const login = useCallback(async (backendToken: string, userData: BackendUser | null) => {
    await sessionManager.setSession(backendToken, userData);
    setSessionToken(sessionManager.token);
    setSessionUser(sessionManager.user);
  }, [sessionManager]);

  const userUpdate = useCallback(async (userData: BackendUser | null) => {
    await sessionManager.updateUser(userData);
    setSessionUser(sessionManager.user);
  }, [sessionManager]);

  const profileUpdate = useCallback(async (profileData: Profile | null) => {
    setSessionProfile(profileData);
  }, []);

  const logout = useCallback(async () => {
    await sessionManager.clearSession();
    setSessionToken(null);
    setSessionUser(null);
    setSessionProfile(null);
    router.replace('/(auth)/intro');
  }, [router, sessionManager]);

  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      try {
        await sessionManager.initialize();
        setSessionToken(sessionManager.token);
        setSessionUser(sessionManager.user);
      } catch (error) {
        if (error) {
          await logout();
        }
      } finally {
        setLoading(false);
      }
    };
    initializeSession();
  }, [sessionManager, logout]);

  return (
    <AuthContext.Provider
      value={{
        user: sessionUser,
        profile: sessionProfile,
        loading,
        token: sessionToken,
        login,
        userUpdate,
        profileUpdate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);