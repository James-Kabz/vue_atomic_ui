import { fileURLToPath, URL } from "node:url"
import { dirname, resolve } from "node:path"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import vueDevTools from "vite-plugin-vue-devtools"
import tailwindcss from "@tailwindcss/vite"

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "VueUI",
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") return "index.esm.js"
        if (format === "cjs") return "index.js"
        return `index.${format}.js`
      },
    },
    rollupOptions: {
      external: [
        "vue",
        "class-variance-authority",
        "clsx", 
        "tailwind-merge",
        "lucide-vue-next"
      ],
      output: {
        globals: {
          vue: "Vue",
          "class-variance-authority": "ClassVarianceAuthority",
          "clsx": "clsx",
          "tailwind-merge": "tailwindMerge",
          "lucide-vue-next": "LucideVueNext"
        },
        // Preserve CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-ui.css';
          return assetInfo.name;
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS into one file
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})