import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import "vite-react-ssg";
import { writeSeoAssets } from "./scripts/build-seo-assets";
import pkg from "./package.json";

const SITE_ORIGIN = "https://calleditor.izumy.me";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  preview: {
    proxy: {
      "/__local_ytdlp": {
        target: "http://127.0.0.1:43125",
        changeOrigin: false,
        rewrite: (url) => url.replace(/^\/__local_ytdlp/, ""),
      },
    },
  },
  server: {
    proxy: {
      "/__local_ytdlp": {
        target: "http://127.0.0.1:43125",
        changeOrigin: false,
        rewrite: (url) => url.replace(/^\/__local_ytdlp/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    formatting: "none",
    crittersOptions: false,
    async onFinished(outDir) {
      await writeSeoAssets(outDir, SITE_ORIGIN);
    },
  },
});
