import { defineConfig } from "vitest/config";
import { resolve } from "path";
import "@testing-library/jest-dom";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["src/tests/unit/**/*.{test,spec}.{ts,tsx}"],
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/public/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
