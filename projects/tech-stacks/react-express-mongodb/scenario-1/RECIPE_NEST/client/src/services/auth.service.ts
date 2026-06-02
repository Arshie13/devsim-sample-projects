import { api } from "./api";
import type { AuthResponse, User } from "../types/user";
import type { ApiSuccess } from "../types/api";

export async function signup(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<ApiSuccess<AuthResponse>>("/auth/signup", input);
  return data.data;
}

export async function login(input: {
  emailOrUsername: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<ApiSuccess<AuthResponse>>("/auth/login", input);
  return data.data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>("/auth/me");
  return data.data;
}
