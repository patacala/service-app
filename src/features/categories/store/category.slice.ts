import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from './category.types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Gestión básica de categorías
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },

    // Gestión de loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Reset del estado
    resetCategoryState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCategories,
  setLoading,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;