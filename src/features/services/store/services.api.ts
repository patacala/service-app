import { apiSlice } from '@/store/api/apiSlice';
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
  Service,
  ServicesResponse,
} from './services.types';

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<ServicesResponse, { page?: number; limit?: number; category?: string }>({
      query: (params) => ({
        url: '/services',
        method: 'GET',
        params,
      }),
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'GET',
      }),
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (serviceData) => ({
        url: '/services',
        method: 'POST',
        data: serviceData,
      }),
    }),
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        data,
      }),
    }),
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
