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
  profile: Profile;
  user: AuthUser;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  location_city: string;
  address: string;
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
