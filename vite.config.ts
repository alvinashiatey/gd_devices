import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        installLaser: resolve(__dirname, "install-laser.html"),
      },
    },
  },
});
