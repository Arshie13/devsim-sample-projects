import { defineConfig } from "vitest/config";
import * as ts from "typescript";

const tsCompilerPlugin = () => ({
  name: "ts-compiler",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (!id.endsWith(".ts")) return;
    // Skip node_modules and declaration files
    if (id.includes("node_modules") || id.endsWith(".d.ts")) return;

    const result = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2021,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        sourceMap: true,
      },
      fileName: id,
    });

    return { code: result.outputText, map: result.sourceMapText };
  },
});

export default defineConfig({
  plugins: [tsCompilerPlugin()],
  test: {
    globals: true,
    environment: "node",
    root: ".",
    include: ["tests/server/**/*.test.ts"],
    globalSetup: ["tests/server/vitest.globalSetup.ts"],
    setupFiles: ["tests/server/setup.ts"],
    testTimeout: 30000,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/main.ts"],
    },
  },
});
