export interface AuthUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  homeCity?: string;
  timezone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
