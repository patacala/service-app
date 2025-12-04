import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Favorite } from './favorites.types';

interface FavoritesState {
  items: Favorite[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.items = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      state.items.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(fav => fav.service_id !== action.payload);
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
  setFavorites,
  addFavorite,
  removeFavorite,
  setLoading,
  setError,
  clearError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
