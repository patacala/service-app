export type ImageVariant = string;
export type MediaVariant = "thumbnail" | "profileThumbnail" | "cover" | "public";

export interface Media{
  id: string;
  providerRef: string;
  variants: Partial<Record<MediaVariant, { url: string }>>;
}

export interface MediaProfile {
  profileThumbnail?: {
    url: string;
  }
}

export interface ImageObject {
  id: string;
  filename?: string;
  uploaded?: string | number;
  metadata?: Record<string, any> | null;
  requireSignedURLs?: boolean;
  variants?: ImageVariant[];
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
  file: RNFileLike;
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
