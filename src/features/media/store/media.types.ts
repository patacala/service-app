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
  downloaded?: boolean;
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

// Video: Direct upload URL request/response types
export interface DirectUploadVideoRequest {
  maxDurationSeconds?: number;
  creator?: string;
  allowedOrigins?: string[];
  requireSignedURLs?: boolean;
  thumbnailTimestampPct?: number; // between 0 and 1
  watermark?: { uid: string } | null;
  meta?: Record<string, any>;
}

export interface DirectUploadVideoResponse {
  uploadURL: string;
  uid: string;
  // Keep the raw provider payload if backend includes it
  result?: {
    uploadURL: string;
    uid: string;
    [key: string]: any;
  };
}

// Perform the actual upload to Cloudflare using the direct upload URL
export interface UploadVideoToDirectUrlRequest {
  uploadURL: string;
  file: RNFileLike;
}

export interface DirectUploadPerformResponse {
  uid?: string;
  [key: string]: any; // Cloudflare response fields vary; keep it flexible
}
