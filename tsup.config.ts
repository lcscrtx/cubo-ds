import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: false,
  sourcemap: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  // dist/tokens.* já foram gerados antes; o CSS dos componentes é montado por scripts/build-css.mjs.
  loader: { ".css": "empty" },
});
