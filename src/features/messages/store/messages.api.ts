import { apiSlice } from '@/store/api/apiSlice';
import type {
  Message,
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesParams,
} from './messages.types';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], GetMessagesParams>({
      query: ({ bookServiceId }) => ({
        url: `/messages/book-service/${bookServiceId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { bookServiceId }) => [
        { type: 'Messages', id: bookServiceId },
      ],
    }),

    createMessage: builder.mutation<CreateMessageResponse, CreateMessageRequest>({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        data,
      }),
      invalidatesTags: (result, error, { bookServiceId }) => [
        { type: 'Messages', id: bookServiceId },
      ],
    }),

    markMessagesAsRead: builder.mutation<{ success: boolean }, string>({
      query: (bookServiceId) => ({
        url: `/messages/book-service/${bookServiceId}/read`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, bookServiceId) => [
        { type: 'Messages', id: bookServiceId },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useMarkMessagesAsReadMutation,
} = messagesApi;