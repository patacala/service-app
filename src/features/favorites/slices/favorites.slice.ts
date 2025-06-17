import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CardPost} from '../../wall/slices/wall.slice';
import { RootState } from '../../../store';

interface FavoritesState {
  items: CardPost[];
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
    fetchFavoritesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFavoritesSuccess: (state, action: PayloadAction<CardPost[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchFavoritesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<CardPost>) => {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

// Selector para verificar si un post es favorito
export const selectIsFavorite = (state: RootState, postId: string) => 
  state.favorites.items.some(item => item.id === postId);

export const {
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  addToFavorites,
  removeFromFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;