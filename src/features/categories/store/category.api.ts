import { apiSlice } from '@/store/api/apiSlice';
import type { 
  CategoriesResponse,
  CategoryResponse,
  GetCategoriesParams,
  UserCategoriesResponse,
  GetUserCategoriesParams
} from './category.types';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, GetCategoriesParams | void>({
      query: (params = {}) => ({
        url: '/categories',
        method: 'GET',
        params,
      }),
      providesTags: ['Category'],
    }),
    getCategory: builder.query<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    getParentCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: '/categories/parents',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    getSubcategories: builder.query<CategoriesResponse, string>({
      query: (parentId) => ({
        url: `/categories/${parentId}/children`,
        method: 'GET',
      }),
      providesTags: (result, error, parentId) => [
        { type: 'Category', id: `subcategories-${parentId}` }
      ],
    }),
    getUserCategories: builder.query<UserCategoriesResponse, GetUserCategoriesParams>({
      query: ({ userId, ...params }) => ({
        url: `/users/${userId}/categories`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'UserCategory', id: userId }
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetParentCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetUserCategoriesQuery,
} = categoryApi;