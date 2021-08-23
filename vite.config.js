import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  root: "frontend",
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    outDir: "../dist"
  },
});