import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Os componentes React Native são testados pelo react-native-web.
    alias: { "react-native": "react-native-web" },
    extensions: [".web.tsx", ".web.ts", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
  },
});
