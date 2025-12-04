// Request
export interface CreateFavoriteRequest {
  service_id: string;
}

// Response
export interface Favorite {
  user_id: string;
  service_id: string;
  createdAt: string;
  updatedAt: string;
}
