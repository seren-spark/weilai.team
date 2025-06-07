import Vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import tailwind from "tailwindcss";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    VueRouter({
      routesFolder: [
        "src/pages",
        {
          src: "src/features/admin/pages",
          path: "admin/",
        },
        {
          src: "src/features/community/pages",
          path: "community/",
        },
        {
          src: "src/features/personalCenter/pages",
          path: "personalCenter/",
        },
        {
          src: "src/features/login/pages",
          path: "login/",
        },
        {
          src: "src/features/application/pages",
          path: "application/",
        },
        {
          src: "src/features/message/pages",
          path: "message/",
        },
        {
          src: "src/features/post/pages",
          path: "post/",
        },
      ],
    }),
    Vue(),
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@admin": resolve(__dirname, "./src/features/admin"),
      "@community": resolve(__dirname, "./src/features/community"),
      "@personalCenter": resolve(__dirname, "./src/features/personalCenter"),
      "@login": resolve(__dirname, "./src/features/login"),
      "@post": resolve(__dirname, "./src/features/post"),
    },
  },
});
