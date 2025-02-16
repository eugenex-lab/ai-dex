// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import wasm from "vite-plugin-wasm";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // Disable the error overlay if needed
    },
  },
  plugins: [
    react(),
    [wasm()],
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // build: {
  //   target: "esnext", // This tells Vite to build for an environment that supports top-level await.
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     target: "esnext", // This tells esbuild (used for dependency pre-bundling) to target esnext.
  //   },
  //   // Alternatively, if issues persist, you can exclude lucid-cardano from optimization:
  //   // exclude: ["lucid-cardano"],
  // },
}));
