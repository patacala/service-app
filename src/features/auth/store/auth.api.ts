import { apiSlice } from '@/store/api/apiSlice';
import type { AuthResponse, RegisterRequest, RegisterResponse, Profile, ProfilePartial } from './auth.types';
import { auth } from '@/infrastructure/config/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Interfaz para la autenticación con Firebase Phone
interface FirebasePhoneAuthResponse {
  user: FirebaseAuthTypes.User;
  token: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint para autenticar con el backend usando token de Firebase
    loginWithFirebase: builder.mutation<AuthResponse, string>({
      query: (firebaseToken) => ({
        url: '/auth/login',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`
        },
      }),
    }),
    
    // Endpoint original de login
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

export const { 
  useLoginMutation, 
  useLoginWithFirebaseMutation,
  useRegisterMutation, 
  useGetCurrentUserQuery, 
  useUpdateProfileMutation 
} = authApi;
