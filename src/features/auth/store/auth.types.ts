// Request
export interface LoginRequest {
  firebaseToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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
