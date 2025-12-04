import { AxiosError, AxiosInstance } from 'axios';
import NetworkConfig from '@/config/network';

/**
 * Configura un interceptor de reintentos para solicitudes fallidas
 * @param axiosInstance Instancia de Axios a configurar
 */
export const setupRetryInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config;
    
    if (!config || !config.headers || (config as any)._retryCount >= NetworkConfig.MAX_RETRIES) {
      return Promise.reject(error);
    }

    (config as any)._retryCount = ((config as any)._retryCount || 0) + 1;
    const shouldRetry = error.code === 'ECONNABORTED' || 
                        !error.response || 
                        (error.response.status >= 500 && error.response.status <= 599);
    
    if (!shouldRetry) {
      return Promise.reject(error);
    }

    const delay = NetworkConfig.RETRY_DELAY * (config as any)._retryCount;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return axiosInstance(config);
  });
};
