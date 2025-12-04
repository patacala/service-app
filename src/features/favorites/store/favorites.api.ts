import { apiSlice } from '@/store/api/apiSlice';
import { CreateFavoriteRequest, Favorite } from './favorites.types';

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFavorite: builder.mutation<Favorite, CreateFavoriteRequest>({
      query: (favoriteData) => ({
        url: '/favorites',
        method: 'POST',
        data: favoriteData,
      }),
      invalidatesTags: ['Favorite'],
    }),
    deleteFavorite: builder.mutation<void, string>({
      query: (serviceId) => ({
        url: `/favorites/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
} = favoritesApi;
