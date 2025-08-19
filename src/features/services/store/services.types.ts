// Request
export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
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
  category: string;
  images: string[];
  provider: {
    id: string;
    name: string;
  };
  rating: number;
  reviewsCount: number;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}
