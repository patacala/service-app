import { apiSlice } from "@/store/api/apiSlice";
import type {
  CreateRatingRequest,
  UpdateRatingRequest,
  Rating,
  RatingListResponse
} from "./ratings.types";

export const ratingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRating: builder.mutation<Rating, CreateRatingRequest>({
      query: (data) => ({
        url: "/ratings",
        method: "POST",
        data,
      }),
      invalidatesTags: ['MyBookServices'],
    }),

    getRatingsByUser: builder.query<RatingListResponse, { userId: string; serviceId?: string }>({
      query: ({ userId, serviceId }) => ({
        url: `/ratings/user/${userId}`,
        method: "GET",
        params: serviceId ? { serviceId } : undefined,
      }),
    }),

    updateRating: builder.mutation<Rating, { id: string; data: UpdateRatingRequest }>({
      query: ({ id, data }) => ({
        url: `/ratings/${id}`,
        method: "PUT",
        data,
      })
    }),

    deleteRating: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: "DELETE",
      })
    }),
  }),
});

export const {
  useCreateRatingMutation,
  useGetRatingsByUserQuery,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} = ratingsApi;
