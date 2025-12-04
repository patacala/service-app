import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Service } from './services.types';

interface ServicesState {
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  selectedService: null,
  isLoading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedService,
  setLoading,
  setError,
  clearError,
} = servicesSlice.actions;

export default servicesSlice.reducer;
