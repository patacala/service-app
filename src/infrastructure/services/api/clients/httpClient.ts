import axios, { AxiosInstance } from 'axios';
import { SessionManager } from '@/infrastructure/session';
import { useAuth } from '@/infrastructure/auth/AuthContext';

const { logout } = useAuth();
const proceedLogout = async () => {
  try {
    /* await GoogleSignin.signOut(); */
    await logout();

    const sessionManager = SessionManager.getInstance();
    await sessionManager.clearSession();
  } catch (error) {
    console.error('Error while signing out:', error);
  }
};

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para agregar token si existe
httpClient.interceptors.request.use(async (config) => {
  const session = SessionManager.getInstance();

  if (!session.token) {
    await session.initialize();
  }

  if (session.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor para manejo de errores globales
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        proceedLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
