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
  rating: string;
  reviewDate: string;
  username: string;
  reviewText: string;
  reviewImages: any[];
  reviewTitle: string;
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
