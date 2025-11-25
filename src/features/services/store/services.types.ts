import { AuthUser } from "@/features/auth/store";
import { DownloadedMedia, MediaObject, MediaProfile } from "@/features/media/store/media.types";

// Services TYPES
export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;            
  categoryIds: string[];    
  media?: MediaObject[];        
  currency?: string;      
  city?: string;
  lat?: number;
  lon?: number;
}

export interface UpdateServiceRequest {
  id: string;
  data: Partial<CreateServiceRequest>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  provider: {
    id: string;
    name: string;
    media: MediaProfile | null;
  };
  rating: number;
  reviewsCount: number;
  city?: string;
  lat?: number;
  lon?: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  media: DownloadedMedia[];
}

export interface MyService {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  rating: number;
  reviewsCount: number;
  city?: string;
  lat?: number;
  lon?: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  media: DownloadedMedia[];
}

export interface ServicesResponse {
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetServicesParams {
  query?: string;
  tag?: string;
  cat?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  near?: string;
  radius?: string;
  page?: number;
  limit?: number;
}

export interface ServicesAccountProvResponse {
  user: AuthUser;
  token: string;
  service: Service
}

// BookServices TYPES
export interface BookService {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  role: string;
  bookingType: string;
  provider: {
    id: string;
    name: string;
    media: MediaProfile | null;
  };
  client: {
    id: string;
    name: string;
    role: string;
    media: MediaProfile | null;
  },
  dateTime: string;     // ISO original
  dateShort: string;    // 21 Apr
  timeShort: string;    // 2:00 PM EST
  address: string;
  comments?: string;
  responsibleName: string;
  phoneNumber: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled" | "rated";
  categories: string[];
  description?: string;
  media: DownloadedMedia[];
}

export interface BookServicesAll {
  myBookings: BookService[],
  otherBookings: BookService[]
}

export interface CreateBookServiceRequest {
  serviceId: string;
  serviceName: string;
  dateTime: string;
  address: string;
  comments?: string;
  responsibleName: string;
  phoneNumber: string;
}

export interface UpdateBookServiceStatusRequest {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}