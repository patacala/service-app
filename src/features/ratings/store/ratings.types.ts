export enum RatingVisibility {
  PUBLIC = "public",
  HIDDEN = "hidden",
}

export interface Rating {
  id: string;
  userId: string;   
  ratedUserId: string;
  serviceId?: string;
  score: number;
  title?: string;
  body?: string;
  visibility: RatingVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface RatingListResponse {
  ratings: Rating[];
}

export interface CreateRatingRequest {
  ratedUserId: string;
  serviceId?: string;
  score: number;
  title?: string;
  body?: string;
  visibility?: RatingVisibility;
}

export interface UpdateRatingRequest {
  score?: number;
  title?: string;
  body?: string;
  visibility?: RatingVisibility;
}
