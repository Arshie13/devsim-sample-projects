export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
