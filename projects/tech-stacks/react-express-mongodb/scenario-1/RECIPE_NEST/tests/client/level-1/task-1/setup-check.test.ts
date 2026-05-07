import { describe, it, expect } from "vitest";
import { api } from "../../../../client/src/services/api";

describe("Level 1 — Task 1: environment is wired up", () => {
  it("axios api client is configured against /api", () => {
    expect(api.defaults.baseURL).toBe("/api");
  });

  it("api client has a request interceptor (auth token attachment)", () => {
    // Output-oriented: the interceptor must exist so authenticated requests
    // pick up the JWT — but we don't assert *which* implementation registered it.
    const handlers = (api.interceptors.request as any).handlers ?? [];
    expect(handlers.length).toBeGreaterThan(0);
  });
});
