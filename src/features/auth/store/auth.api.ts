import { apiSlice } from '@/store/api/apiSlice';
import type { RegisterRequest, AuthResponse, AuthUser, RegisterResponse } from './auth.types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, void>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
    updateProfile: builder.mutation<AuthUser, Partial<AuthUser>>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PATCH',
        data: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
