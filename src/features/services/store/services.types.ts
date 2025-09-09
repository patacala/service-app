import { CardPost } from "@/features/wall";
// Services TYPES

export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;            
  categoryIds: string[];    
  images?: string[];        
  currency?: string;      
  city?: string;
  lat?: number;
  lon?: number;
  coverMediaId?: string;
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
  images: string[];            
  provider: {
    id: string;
    name: string;
  };
  rating: number;             
  reviewsCount: number;        
  city?: string;               
  lat?: number;
  lon?: number;
  createdAt: string;         
  updatedAt: string;           
  isFavorite: boolean;
}

export interface ServicesResponse {
  data: CardPost[];
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

// BookServices TYPES
export interface BookService {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  dateTime: string;
  address: string;
  comments?: string;
  responsibleName: string;
  phoneNumber: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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