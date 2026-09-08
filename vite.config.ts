import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        installPrinters: resolve(__dirname, "install-printers.html"),
        installLaser: resolve(__dirname, "install-laser.html"),
      },
    },
  },
});
