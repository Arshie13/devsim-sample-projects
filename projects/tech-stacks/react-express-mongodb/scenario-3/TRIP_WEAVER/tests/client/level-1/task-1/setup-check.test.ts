import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../../../..");

describe("L1-T1: Development Environment Setup", () => {
  it("client package.json exists", () => {
    expect(existsSync(resolve(ROOT, "client/package.json"))).toBe(true);
  });

  it("server package.json exists", () => {
    expect(existsSync(resolve(ROOT, "server/package.json"))).toBe(true);
  });

  it("client node_modules directory exists (npm install was run)", () => {
    expect(existsSync(resolve(ROOT, "client/node_modules"))).toBe(true);
  });

  it("server node_modules directory exists (npm install was run)", () => {
    expect(existsSync(resolve(ROOT, "server/node_modules"))).toBe(true);
  });

  it("server .env file exists", () => {
    expect(existsSync(resolve(ROOT, "server/.env"))).toBe(true);
  });
});
