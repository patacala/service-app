// Request
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Response
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'PUBLISHER' | 'SEEKER';
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
