import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // O tu config de entorno
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para agregar token si existe
httpClient.interceptors.request.use(async (config) => {
  // TODO: Reemplaza por tu lógica real de obtención de token
  const token = null; // <-- aquí deberías obtener el token de redux, storage, etc
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores globales
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales, logout en 401, etc
    return Promise.reject(error);
  }
);

export default httpClient;
