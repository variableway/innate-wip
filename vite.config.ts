import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(pkgDir, "../..")

export default defineConfig({
  base: process.env.PUBLIC_PATH ?? "./",
  plugins: [tailwindcss(), react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: { port: 4016, strictPort: true, fs: { allow: [repoRoot, pkgDir] } },
  preview: { port: 4016, strictPort: true },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
