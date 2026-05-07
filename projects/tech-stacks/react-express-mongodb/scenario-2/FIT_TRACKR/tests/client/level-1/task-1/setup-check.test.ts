import { describe, it, expect } from "vitest";
import { api } from "../../../../client/src/services/api";

describe("Level 1 — Task 1: environment is wired up", () => {
  it("axios api client is configured against /api", () => {
    expect(api.defaults.baseURL).toBe("/api");
  });

  it("api client has a request interceptor (auth token attachment)", () => {
    const handlers = (api.interceptors.request as any).handlers ?? [];
    expect(handlers.length).toBeGreaterThan(0);
  });
});
