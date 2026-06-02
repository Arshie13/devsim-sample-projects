import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "../tests/server/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["../tests/server/setup.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
  },
});
