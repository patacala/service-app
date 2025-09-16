import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { SessionManager } from '@/infrastructure/session';
import { useRouter } from 'expo-router';
import { store } from '@/store';
import { apiSlice } from '@/store/api/apiSlice';

interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  location_city: string;
  address: string;
}

type AuthContextType = {
  user: BackendUser | null;
  loading: boolean;
  token: string | null;
  login: (backendToken: string, userData: BackendUser | null) => Promise<void>;
  userUpdate: (userData: BackendUser | null) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  login: async () => {},
  userUpdate: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<BackendUser | null>(null);

  const sessionManager = SessionManager.getInstance();
  const router = useRouter();

  const login = async (backendToken: string, userData: BackendUser | null) => {
    await sessionManager.setSession(backendToken, userData);
    setSessionToken(sessionManager.token);
    setSessionUser(sessionManager.user);
  };

  const userUpdate = async (userData: BackendUser | null) => {
    await sessionManager.updateUser(userData);
    setSessionUser(sessionManager.user);
  };

  const logout = async () => {
    await sessionManager.clearSession();
    setSessionToken(null);
    setSessionUser(null);
    router.replace('/intro');
  };

  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      try {
        await sessionManager.initialize();
        setSessionToken(sessionManager.token);
        setSessionUser(sessionManager.user);
      } catch (error) {
        await logout();
      } finally {
        setLoading(false);
      }
    };
    initializeSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: sessionUser,
        loading,
        token: sessionToken,
        login,
        userUpdate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir fácilmente el contexto en cualquier componente
export const useAuth = () => useContext(AuthContext);
