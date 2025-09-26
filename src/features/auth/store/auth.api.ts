import { apiSlice } from '@/store/api/apiSlice';
import type { AuthResponse, RegisterRequest, RegisterResponse, Profile, ProfilePartial } from './auth.types';

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
    getCurrentUser: builder.query<Profile, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<{ message: string }, Partial<ProfilePartial>>({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        data: profileData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery, useUpdateProfileMutation } = authApi;
