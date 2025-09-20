import { apiSlice } from '@/store/api/apiSlice';
import type {
  ImageObject,
  ListImagesParams,
  RNFileLike,
  UpdateImageRequest,
  UploadImageRequest,
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
    uploadImage: builder.mutation<ImageObject, UploadImageRequest>({
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

    listImages: builder.query<ImageObject[], ListImagesParams | void>({
      query: (params) => ({
        url: '/media/images',
        method: 'GET',
        params,
      }),
      providesTags: ['Media'],
    }),

    getImageById: builder.query<ImageObject, string>({
      query: (id) => ({
        url: `/media/images/${id}`,
        method: 'GET',
      }),
      providesTags: ['Media'],
    }),

    updateImage: builder.mutation<ImageObject, UpdateImageRequest>({
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
  }),
});

export const {
  useUploadImageMutation,
  useListImagesQuery,
  useGetImageByIdQuery,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = mediaApi;
