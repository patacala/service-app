import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ServiceStats {
  serviceId: string;
  views: number;
  favorites: number;
  contactRequests: number;
}

interface AnalyticsState {
  serviceStats: ServiceStats[];
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  serviceStats: [],
  selectedPeriod: 'month',
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    fetchStatsStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action: PayloadAction<ServiceStats[]>) => {
      state.isLoading = false;
      state.serviceStats = action.payload;
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedPeriod: (
      state,
      action: PayloadAction<'day' | 'week' | 'month' | 'year'>,
    ) => {
      state.selectedPeriod = action.payload;
    },
    incrementServiceView: (state, action: PayloadAction<string>) => {
      const stat = state.serviceStats.find(s => s.serviceId === action.payload);
      if (stat) {
        stat.views += 1;
      }
    },
  },
});

export const {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  setSelectedPeriod,
  incrementServiceView,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
