// Request
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

// Response
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
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}
