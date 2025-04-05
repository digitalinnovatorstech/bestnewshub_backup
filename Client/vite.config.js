import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteSitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    ViteSitemap({
      siteUrl: "http://bestnewshub.com",
      generateRobotsTxt: false,
    }),
    react(),
  ],
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ["quill", "react-quill", "quill-table-ui", "react-swipeable-list"],
  },
  build: {
    outDir: "build",
    commonjsOptions: {
      include: [
        /node_modules/,
        /quill/,
        /quill-table-ui/,
        /react-swipeable-list/,
      ],
    },
  },
});
