import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl"
import { resolve } from "path"
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteBasicSslPlugin()
  ],
  server: {
    https: true
  },
  build: {
    lib: {
      name: `shopify-partners`,
      entry: resolve(__dirname, "src/main.ts"),
      fileName: () => "shopify-partners.js",
      formats: ["es"],
    },
    target: 'esnext'
  }
})
