import { api } from "./api";
import type { AuthUser } from "../types/user";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function signup(name: string, username: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>("/auth/signup", {
    name,
    username,
    email,
    password,
  });
  return data.data;
}

export async function login(emailOrUsername: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>("/auth/login", {
    emailOrUsername,
    password,
  });
  return data.data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<{ success: boolean; data: AuthUser }>("/auth/me");
  return data.data;
}
