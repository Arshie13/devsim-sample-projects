const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let payload: ApiEnvelope<T> | undefined;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error ?? payload?.message ?? "Request failed.");
  }

  return payload.data as T;
}
