import { unpluginLitSass } from "unplugin-lit-sass";
import { defineConfig, transformWithEsbuild } from "vite";

export default defineConfig({
  plugins: [unpluginLitSass.vite()],
  /* css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
  }, */
});
