import { apiSlice } from '@/store/api/apiSlice';
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
  Service,
  ServicesResponse,
  GetServicesParams,
  CreateBookServiceRequest,
  BookService,
  ServicesAccountProvResponse,
  BookServicesAll,
  UpdateBookServiceStatusRequest,
  MyService,
} from './services.types';

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccountProvService: builder.mutation<ServicesAccountProvResponse, CreateServiceRequest>({
      query: (serviceData) => ({
        url: '/services/provider-account',
        method: 'POST',
        data: serviceData,
      }),
      invalidatesTags: ['Service', 'MyServices'],
    }),
    getServices: builder.query<ServicesResponse, GetServicesParams>({
      query: (params) => ({
        url: '/services',
        method: 'GET',
        params,
      }),
      providesTags: ['Service', 'Favorite'],
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'GET',
      }),
    }),
    getMyServices: builder.query<MyService[], void>({ 
      query: () => ({
        url: '/services/me',
        method: 'GET',
      }),
      providesTags: ['MyServices'],
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (serviceData) => ({
        url: '/services',
        method: 'POST',
        data: serviceData,
      }),
      invalidatesTags: ['Service', 'MyServices'],
    }),
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Service', 'MyServices'],
    }),
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
    }),
    createBookService: builder.mutation<BookService, CreateBookServiceRequest>({
      query: (bookServiceData) => ({
        url: '/book-services',
        method: 'POST',
        data: bookServiceData,
      }),
      invalidatesTags: ['MyBookServices'],
    }),
    getMyBookServices: builder.query<BookServicesAll, void>({
      query: () => ({
        url: '/book-services/me',
        method: 'GET',
      }),
      providesTags: ['MyBookServices'],
    }),
    updateBookServiceStatus: builder.mutation<BookService, UpdateBookServiceStatusRequest>({
      query: ({ id, status }) => ({
        url: `/book-services/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['MyBookServices'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useGetMyServicesQuery,
  useCreateAccountProvServiceMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetMyBookServicesQuery,
  useCreateBookServiceMutation,
  useUpdateBookServiceStatusMutation
} = servicesApi;
