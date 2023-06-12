import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import alias from "@rollup/plugin-alias";

export default defineConfig({
  plugins: [vue(), alias()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      /*  @/ 代表src 路径下 ， @ 代表全局路径下 */
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./common/"),
      $: path.resolve(__dirname, "./"), // 根目录
    },
  },
});
