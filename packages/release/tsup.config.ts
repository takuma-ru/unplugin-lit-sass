import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["cjs"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
