import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rating } from './ratings.types';

interface RatingsState {
  ratings: Rating[];
  selectedRating: Rating | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RatingsState = {
  ratings: [],
  selectedRating: null,
  isLoading: false,
  error: null,
};

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setRatings: (state, action: PayloadAction<Rating[]>) => {
      state.ratings = action.payload;
    },
    setSelectedRating: (state, action: PayloadAction<Rating | null>) => {
      state.selectedRating = action.payload;
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
  setRatings,
  setSelectedRating,
  setLoading,
  setError,
  clearError,
} = ratingsSlice.actions;

export default ratingsSlice.reducer;
