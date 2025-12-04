import { apiSlice } from '@/store/api/apiSlice';
import type {
  MediaObject,
  ListImagesParams,
  RNFileLike,
  UpdateImageRequest,
  UploadImageRequest,
  DirectUploadVideoRequest,
  DirectUploadVideoResponse,
  UploadVideoToDirectUrlRequest,
  DirectUploadPerformResponse,
} from './media.types';

const buildFormData = (file: RNFileLike) => {
  const form = new FormData();
  // @ts-ignore React Native types for FormData accept file object
  form.append('file', {
    uri: file.uri,
    name: file.name || 'image.jpg',
    type: file.type || 'application/octet-stream',
  } as any);
  return form;
};

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<MediaObject, UploadImageRequest>({
      query: ({ file, params }) => {
        const formData = buildFormData(file);
        const queryParams: Record<string, any> = {};
        if (typeof params?.requireSignedURLs === 'boolean') {
          queryParams.requireSignedURLs = params.requireSignedURLs;
        }
        if (params?.metadata) {
          queryParams.metadata = JSON.stringify(params.metadata);
        }
        return {
          url: '/media/images',
          method: 'POST',
          data: formData,
          params: queryParams,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      invalidatesTags: ['Media'],
    }),

    listImages: builder.query<MediaObject[], ListImagesParams | void>({
      query: (params) => ({
        url: '/media/images',
        method: 'GET',
        params,
      }),
      providesTags: ['Media'],
    }),

    getImageById: builder.query<MediaObject, string>({
      query: (id) => ({
        url: `/media/images/${id}`,
        method: 'GET',
      }),
      providesTags: ['Media'],
    }),

    updateImage: builder.mutation<MediaObject, UpdateImageRequest>({
      query: ({ id, data }) => ({
        url: `/media/images/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Media'],
    }),

    deleteImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/media/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
    // Cloudflare Stream: request a direct upload URL for videos
    createVideoDirectUploadUrl: builder.mutation<DirectUploadVideoResponse, DirectUploadVideoRequest | void>({
      query: (body) => ({
        url: '/media/videos/direct-upload-url',
        method: 'POST',
        data: body ?? {},
      }),
    }),

    // Upload the video file directly to Cloudflare using the obtained uploadURL
    uploadVideoToDirectUrl: builder.mutation<DirectUploadPerformResponse, UploadVideoToDirectUrlRequest>({
      query: ({ uploadURL, file }) => {
        const formData = buildFormData(file);
        return {
          url: uploadURL, // absolute URL to Cloudflare, bypasses baseURL
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Large uploads can take time; allow up to 10 minutes
          timeout: 600000,
        };
      },
    }),
  }),
});

export const {
  useUploadImageMutation,
  useListImagesQuery,
  useGetImageByIdQuery,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useCreateVideoDirectUploadUrlMutation,
  useUploadVideoToDirectUrlMutation,
} = mediaApi;
