import api from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from "../types/user";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return res.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data;
}

export async function getMe(): Promise<AuthUser> {
  const res = await api.get<{ success: boolean; data: AuthUser }>("/auth/me");
  return res.data.data;
}
