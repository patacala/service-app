import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Category', 'UserCategory', 'Service', 'MyServices', 'Favorite'],
  endpoints: () => ({}),
});
