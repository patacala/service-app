export enum RatingVisibility {
  PUBLIC = "public",
  HIDDEN = "hidden",
}

export enum RoleOfRater {
  CLIENT = "client",
  PROVIDER = "provider",
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
  serviceId: string;
  bookingId?: string | null;
  roleOfRater: RoleOfRater;
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
