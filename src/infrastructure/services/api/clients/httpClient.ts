import axios, { AxiosInstance } from 'axios';
import { SessionManager } from '@/infrastructure/session';
import { proceedLogout } from '@/infrastructure/auth/proceedLogout';
import NetworkConfig from '@/config/network';
import { setupRetryInterceptor } from '../interceptors/retryInterceptor';

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: NetworkConfig.REQUEST_TIMEOUT, // Configurado desde NetworkConfig
});


httpClient.interceptors.request.use(async (config) => {
  const session = SessionManager.getInstance();

  if (!session.token) {
    await session.initialize();
  }

  if (session.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (isFormData) {

    delete (config.headers as any)['Content-Type'];
  } else {
    (config.headers as any)['Content-Type'] = (config.headers as any)['Content-Type'] || 'application/json';
  }
  return config;
});

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

// Configurar el interceptor de reintentos
setupRetryInterceptor(httpClient);

export default httpClient;
