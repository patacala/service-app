import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SessionManager } from '@/infrastructure/session';

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
    console.log('Inicio de Token');
    console.log(session.token);
    console.log('Fin de Token');
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor para manejo de errores globales
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
