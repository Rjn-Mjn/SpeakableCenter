import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/dashboard/",
  build: {
    outDir: path.resolve(
      new URL(".", import.meta.url).pathname,
      "../public/dashboard"
    ),
    emptyOutDir: true,
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
});
