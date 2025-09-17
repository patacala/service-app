import { CardPost } from "@/features/wall";
import { ImageSourcePropType } from "react-native";
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
  role: string;
  provider: {
    id: string;
    name: string;
  };
  client: {
    id: string,
    name: string,
    role: string
  },
  dateTime: string;     // ISO original
  dateShort: string;    // 21 Apr
  timeShort: string;    // 2:00 PM EST
  address: string;
  comments?: string;
  responsibleName: string;
  phoneNumber: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  categories: string[];
  description?: string;
  image?: ImageSourcePropType
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