import { IconName } from '@/design-system/components/layout/Icon';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicesState {
  items: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChipOption {
  id: string;
  label: string;
  icon: IconName;
}

const initialState: ServicesState = {
  items: [],
  selectedService: null,
  isLoading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    fetchServicesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchServicesSuccess: (state, action: PayloadAction<Service[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchServicesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectService: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;
    },
    createServiceStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    createServiceSuccess: (state, action: PayloadAction<Service>) => {
      state.isLoading = false;
      state.items.push(action.payload);
    },
    createServiceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
  selectService,
  createServiceStart,
  createServiceSuccess,
  createServiceFailure,
} = servicesSlice.actions;

export default servicesSlice.reducer;
