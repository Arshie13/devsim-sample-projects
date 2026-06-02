export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  role: "member" | "coach";
  followers: string[];
  following: string[];
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  username: string;
  email: string;
}
