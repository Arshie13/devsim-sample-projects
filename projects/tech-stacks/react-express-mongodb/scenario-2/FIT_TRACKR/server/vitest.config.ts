import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["../tests/server/setup.ts"],
    globals: true,
    pool: "forks",
    testTimeout: 30000,
  },
});
