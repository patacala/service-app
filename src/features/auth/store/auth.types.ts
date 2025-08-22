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
  profile: string;
  user: AuthUser;
}

// Response
export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
