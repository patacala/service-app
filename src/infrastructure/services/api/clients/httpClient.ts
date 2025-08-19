import axios from 'axios';
import { SessionManager } from '@/infrastructure/session';

const httpClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export { httpClient };
