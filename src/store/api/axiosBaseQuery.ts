import type { AxiosRequestConfig } from 'axios';
import httpClient from '@/infrastructure/services/api/clients/httpClient';

export interface BaseQueryArgs {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: any;
}

export const axiosBaseQuery = () => async ({ url, method, data, params, headers }: BaseQueryArgs) => {
  try {
    const config: AxiosRequestConfig = { url, method, data, params, headers };
    const result = await httpClient(config);
    return { data: result.data };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
        message: error.message,
      },
    };
  }
};
