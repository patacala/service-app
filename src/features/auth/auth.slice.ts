import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { UserRole } from './slices/auth.slice';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userRole: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{token: string; userRole: UserRole}>,
    ) => {
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: state => {
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {setCredentials, logout, setLoading, setError} = authSlice.actions;
export default authSlice.reducer;
