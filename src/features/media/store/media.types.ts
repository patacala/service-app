export type ImageVariant = string;

export interface ImageObject {
  id: string;
  filename?: string;
  uploaded?: string | number;
  metadata?: Record<string, any> | null;
  requireSignedURLs?: boolean;
  variants?: ImageVariant[];
  // Allow arbitrary fields coming from backend
  [key: string]: any;
}

export interface UploadImageQueryParams {
  requireSignedURLs?: boolean;
  metadata?: Record<string, any>;
}

export interface RNFileLike {
  uri: string;
  name: string;
  type: string;
}

export interface UploadImageRequest {
  file: RNFileLike; // React Native file-like object
  params?: UploadImageQueryParams;
}

export interface UpdateImageRequest {
  id: string;
  data: {
    requireSignedURLs?: boolean;
    metadata?: Record<string, any>;
  };
}

export interface ListImagesParams {
  page?: number;
  limit?: number;
}
