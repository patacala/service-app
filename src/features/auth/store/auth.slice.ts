import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthResponse } from './auth.types';
import auth from '@/infrastructure/config/firebase';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  firebaseToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  firebaseToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Función auxiliar para cerrar sesión con Firebase
export const signOutFromFirebase = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error: any) {
    console.error('Error signing out from Firebase:', error);
    throw error;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setFirebaseToken: (state, action: PayloadAction<string>) => {
      state.firebaseToken = action.payload;
    },
    setAuthData: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.firebaseToken = null;
      state.error = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // No necesitamos extraReducers ya que usamos RTK Query para las llamadas a la API
});

export const {
  setUser,
  setToken,
  setFirebaseToken,
  setAuthData,
  setLoading,
  setError,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
