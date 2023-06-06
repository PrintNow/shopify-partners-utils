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
      name: `ShopifyPartnersUtils`,
      entry: resolve(__dirname, "src/main.ts"),
      fileName: () => "shopify-partners-utils.js",
      formats: ["iife"],
    },
    target: 'es2018'
  }
})
