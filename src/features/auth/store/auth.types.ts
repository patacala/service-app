import { DownloadedMedia, MediaObject, MediaVariant } from "@/features/media/store/media.types";

// Request
export interface RegisterRequest {
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  selectedCategories?: string[];
}

// Response
export interface RegisterResponse {
  message: string;
  profile: Profile;
  user: AuthUser;
}

// Response
export interface Profile {
  profile_id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  media: {
    id: string;
    providerRef: string;
    variants: Partial<Record<MediaVariant, { url: string }>>;
  }[];
}

// Request
export interface ProfilePartial {
  name: string;
  city: string;
  address: string;
  media?: MediaObject;
}

// Response
export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

// Response
export interface AuthResponse {
  user: AuthUser;
  token: string;
}
