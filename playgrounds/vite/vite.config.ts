import { unpluginLitSass } from "unplugin-lit-sass";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [unpluginLitSass.vite()],
});
