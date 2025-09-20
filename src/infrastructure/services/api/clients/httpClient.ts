import axios, { AxiosInstance } from 'axios';
import { SessionManager } from '@/infrastructure/session';
import { proceedLogout } from '@/infrastructure/auth/proceedLogout';

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
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
  // Ajustar Content-Type según el payload
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (isFormData) {
    // Deja que Axios establezca el boundary automáticamente
    delete (config.headers as any)['Content-Type'];
  } else {
    (config.headers as any)['Content-Type'] = (config.headers as any)['Content-Type'] || 'application/json';
  }
  return config;
});

// Interceptor para manejo de errores globales
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        await proceedLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
