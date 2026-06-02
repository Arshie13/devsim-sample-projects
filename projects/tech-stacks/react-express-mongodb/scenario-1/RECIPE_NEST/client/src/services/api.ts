import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("rn_token", token);
  else localStorage.removeItem("rn_token");
}
