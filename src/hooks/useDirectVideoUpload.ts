import { useCallback } from 'react';
import {
  useCreateVideoDirectUploadUrlMutation,
  useUploadVideoToDirectUrlMutation,
} from '@/features/media/store/media.api';
import type {
  DirectUploadVideoRequest,
  RNFileLike,
} from '@/features/media/store/media.types';

export interface DirectVideoUploadReturn {
  uploadVideo: (file: RNFileLike, options?: DirectUploadVideoRequest) => Promise<{ uid: string; uploadURL: string }>;
  isLoading: boolean;
  isCreating: boolean;
  isUploading: boolean;
  error: any;
  reset: () => void;
}

export const useDirectVideoUpload = (): DirectVideoUploadReturn => {
  const [createUploadUrl, { isLoading: isCreating, error: createError, reset: resetCreate }] =
    useCreateVideoDirectUploadUrlMutation();

  const [uploadToDirectUrl, { isLoading: isUploading, error: uploadError, reset: resetUpload }] =
    useUploadVideoToDirectUrlMutation();

  const uploadVideo = useCallback(
    async (file: RNFileLike, options?: DirectUploadVideoRequest) => {
      // 1) Obtener URL de carga directa
      const { uploadURL, uid } = await createUploadUrl(options ?? {}).unwrap();

      // 2) Subir archivo a Cloudflare con la URL directa
      await uploadToDirectUrl({ uploadURL, file }).unwrap();

      return { uid, uploadURL };
    },
    [createUploadUrl, uploadToDirectUrl]
  );

  const reset = useCallback(() => {
    resetCreate();
    resetUpload();
  }, [resetCreate, resetUpload]);

  return {
    uploadVideo,
    isLoading: isCreating || isUploading,
    isCreating,
    isUploading,
    error: createError || uploadError,
    reset,
  };
};
