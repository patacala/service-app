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
    const payload = result?.data;
    const normalized = payload && typeof payload === 'object' && 'result' in payload ? payload.result : payload;
    return { data: normalized };
  } catch (error: any) {
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    const envelopeMessage = typeof responseData === 'object' ? (responseData?.message || responseData?.error) : undefined;
    const envelopeErrors = typeof responseData === 'object' ? (responseData?.errors || responseData?.error) : undefined;
    return {
      error: {
        status,
        data: responseData ?? error.message,
        message: envelopeMessage || error.message,
        errors: envelopeErrors,
      },
    };
  }
};
