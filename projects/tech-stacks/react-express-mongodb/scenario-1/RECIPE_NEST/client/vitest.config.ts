import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client"),
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom"),
      "@testing-library/react": path.resolve(__dirname, "node_modules/@testing-library/react"),
      "@testing-library/jest-dom": path.resolve(__dirname, "node_modules/@testing-library/jest-dom"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setup.ts"],
    server: {
      deps: {
        inline: [
          "react",
          "react-dom",
          "@testing-library/react",
          "@testing-library/jest-dom",
        ],
      },
    },
    include: [
      "src/**/*.test.tsx",
      "src/**/*.test.ts",
      "../tests/client/**/*.test.tsx",
      "../tests/client/**/*.test.ts",
    ],
    exclude: ["node_modules", "dist"],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
  },
});
