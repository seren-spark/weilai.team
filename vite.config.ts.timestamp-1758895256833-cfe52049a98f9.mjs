// vite.config.ts
import Vue from "file:///C:/Users/H/Desktop/WeiLai/perf/weilai.team/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import autoprefixer from "file:///C:/Users/H/Desktop/WeiLai/perf/weilai.team/node_modules/autoprefixer/lib/autoprefixer.js";
import { resolve } from "node:path";
import tailwind from "file:///C:/Users/H/Desktop/WeiLai/perf/weilai.team/node_modules/tailwindcss/lib/index.js";
import VueRouter from "file:///C:/Users/H/Desktop/WeiLai/perf/weilai.team/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig } from "file:///C:/Users/H/Desktop/WeiLai/perf/weilai.team/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Users\\H\\Desktop\\WeiLai\\perf\\weilai.team";
var vite_config_default = defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
        // 移除console
        dead_code: true
        // 移除死代码
      },
      output: {
        comments: false
        // 移除注释
      }
    },
    // 启用资源内联
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("src/pages/index.vue")) {
            return "homepage-critical";
          }
          if (id.includes("src/features/homePage/components/topNav")) {
            return "homepage-nav";
          }
          if (id.includes("swiper")) {
            return "swiper";
          }
          if (id.includes("assets/img/homePage")) {
            return "homepage-images";
          }
          if (id.includes("node_modules") && (id.includes("element-plus") || id.includes("ant-design-vue"))) {
            return "ui-components";
          }
          if (id.includes("node_modules")) {
            if (id.includes("highlight.js")) {
              return "highlight";
            }
            if (id.includes("lucide-vue-next")) {
              return "lucide-icons";
            }
            if (id.includes("radix-vue")) {
              return "radix-ui";
            }
            if (id.includes("@tiptap") || id.includes("tiptap")) {
              return "tiptap-editor";
            }
            if (id.includes("handsontable") || id.includes("hyperformula")) {
              return "handsontable";
            }
            return "vendor";
          }
        }
      }
    },
    cssCodeSplit: true,
    // 预加载策略
    polyfillModulePreload: true
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "swiper/vue"],
    exclude: [
      "@tiptap/vue-3",
      "handsontable",
      "highlight.js",
      "lucide-vue-next"
    ]
  },
  plugins: [
    VueRouter({
      routesFolder: [
        "src/pages",
        {
          src: "src/features/admin/pages",
          path: "admin/"
        },
        {
          src: "src/features/community/pages",
          path: "community/"
        },
        {
          src: "src/features/personalCenter/pages",
          path: "personalCenter/"
        },
        {
          src: "src/features/login/pages",
          path: "login/"
        },
        {
          src: "src/features/application/pages",
          path: "application/"
        },
        {
          src: "src/features/message/pages",
          path: "message/"
        },
        {
          src: "src/features/post/pages",
          path: "post/"
        }
      ]
    }),
    Vue()
    // viteImagemin({
    //   gifsicle: {
    //     interlaced: false,
    //   },
    //   optipng: {
    //     optimizationLevel: 7,
    //   },
    //   mozjpeg: {
    //     progressive: true,
    //     quality: 65,
    //   },
    //   pngquant: {
    //     quality: [0.65, 0.9],
    //     speed: 4,
    //   },
    //   svgo: {
    //     plugins: [
    //       {
    //         name: "removeViewBox",
    //       },
    //       {
    //         name: "removeEmptyAttrs",
    //         active: false,
    //       },
    //     ],
    //   },
    // }),
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@admin": resolve(__vite_injected_original_dirname, "./src/features/admin"),
      "@community": resolve(__vite_injected_original_dirname, "./src/features/community"),
      "@personalCenter": resolve(__vite_injected_original_dirname, "./src/features/personalCenter"),
      "@login": resolve(__vite_injected_original_dirname, "./src/features/login"),
      "@post": resolve(__vite_injected_original_dirname, "./src/features/post")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIXFxcXERlc2t0b3BcXFxcV2VpTGFpXFxcXHBlcmZcXFxcd2VpbGFpLnRlYW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEhcXFxcRGVza3RvcFxcXFxXZWlMYWlcXFxccGVyZlxcXFx3ZWlsYWkudGVhbVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSC9EZXNrdG9wL1dlaUxhaS9wZXJmL3dlaWxhaS50ZWFtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IFZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG5pbXBvcnQgVnVlUm91dGVyIGZyb20gXCJ1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdml0ZUltYWdlbWluIGZyb20gXCJ2aXRlLXBsdWdpbi1pbWFnZW1pblwiO1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6IFwidGVyc2VyXCIsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbXCJjb25zb2xlLmxvZ1wiLCBcImNvbnNvbGUuaW5mb1wiXSwgLy8gXHU3OUZCXHU5NjY0Y29uc29sZVxuICAgICAgICBkZWFkX2NvZGU6IHRydWUsIC8vIFx1NzlGQlx1OTY2NFx1NkI3Qlx1NEVFM1x1NzgwMVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBjb21tZW50czogZmFsc2UsIC8vIFx1NzlGQlx1OTY2NFx1NkNFOFx1OTFDQVxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFx1NTQyRlx1NzUyOFx1OEQ0NFx1NkU5MFx1NTE4NVx1ODA1NFxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIFx1NTE3M1x1OTUyRVx1OEQ0NFx1NkU5MFx1NTM1NVx1NzJFQ1x1NjI1M1x1NTMwNVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcInNyYy9wYWdlcy9pbmRleC52dWVcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcImhvbWVwYWdlLWNyaXRpY2FsXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcInNyYy9mZWF0dXJlcy9ob21lUGFnZS9jb21wb25lbnRzL3RvcE5hdlwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiaG9tZXBhZ2UtbmF2XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcInN3aXBlclwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwic3dpcGVyXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFx1NUMwNlx1NTZGRVx1NzI0N1x1OEQ0NFx1NkU5MFx1NTM1NVx1NzJFQ1x1NTkwNFx1NzQwNlxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcImFzc2V0cy9pbWcvaG9tZVBhZ2VcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcImhvbWVwYWdlLWltYWdlc1wiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFx1NTIwNlx1NzlCQlVJXHU3RUM0XHU0RUY2XHVGRjA4XHU2ODM5XHU2MzZFXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU3Njg0XHU3RUM0XHU0RUY2XHU1RTkzXHU4QzAzXHU2NTc0XHVGRjA5XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikgJiZcbiAgICAgICAgICAgIChpZC5pbmNsdWRlcyhcImVsZW1lbnQtcGx1c1wiKSB8fCBpZC5pbmNsdWRlcyhcImFudC1kZXNpZ24tdnVlXCIpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFwidWktY29tcG9uZW50c1wiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFx1NTE3M1x1OTUyRVx1RkYxQVx1NTIwNlx1NzlCQlx1NTkyN1x1NTc4Qlx1NUU5M1xuICAgICAgICAgIC8vIFx1NTNFQVx1NTIwNlx1NTI3Mlx1NjYwRVx1Nzg2RVx1NUI4OVx1NTE2OFx1NzY4NFx1NTkyN1x1NTc4Qlx1NUU5M1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgLy8gXHU1M0VBXHU1MjA2XHU1MjcyXHU4RkQ5XHU0RTlCXHU2NjBFXHU3ODZFXHU1Qjg5XHU1MTY4XHU3Njg0XHU1OTI3XHU1NzhCXHU1RTkzXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJoaWdobGlnaHQuanNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJsdWNpZGUtdnVlLW5leHRcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwibHVjaWRlLWljb25zXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJyYWRpeC12dWVcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwicmFkaXgtdWlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIkB0aXB0YXBcIikgfHwgaWQuaW5jbHVkZXMoXCJ0aXB0YXBcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwidGlwdGFwLWVkaXRvclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwiaGFuZHNvbnRhYmxlXCIpIHx8IGlkLmluY2x1ZGVzKFwiaHlwZXJmb3JtdWxhXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImhhbmRzb250YWJsZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gXHU1MTc2XHU0RUQ2XHU2MjQwXHU2NzA5XHU1RTkzXHU5MEZEXHU2NTNFXHU1NzI4dmVuZG9yXHU0RTJEXG4gICAgICAgICAgICByZXR1cm4gXCJ2ZW5kb3JcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIC8vIFx1OTg4NFx1NTJBMFx1OEY3RFx1N0I1Nlx1NzU2NVxuICAgIHBvbHlmaWxsTW9kdWxlUHJlbG9hZDogdHJ1ZSxcbiAgfSxcbiAgLy8gXHU0RjE4XHU1MzE2XHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcInZ1ZVwiLCBcInZ1ZS1yb3V0ZXJcIiwgXCJwaW5pYVwiLCBcInN3aXBlci92dWVcIl0sXG4gICAgZXhjbHVkZTogW1xuICAgICAgXCJAdGlwdGFwL3Z1ZS0zXCIsXG4gICAgICBcImhhbmRzb250YWJsZVwiLFxuICAgICAgXCJoaWdobGlnaHQuanNcIixcbiAgICAgIFwibHVjaWRlLXZ1ZS1uZXh0XCIsXG4gICAgXSxcbiAgfSxcblxuICBwbHVnaW5zOiBbXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIHJvdXRlc0ZvbGRlcjogW1xuICAgICAgICBcInNyYy9wYWdlc1wiLFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcInNyYy9mZWF0dXJlcy9hZG1pbi9wYWdlc1wiLFxuICAgICAgICAgIHBhdGg6IFwiYWRtaW4vXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IFwic3JjL2ZlYXR1cmVzL2NvbW11bml0eS9wYWdlc1wiLFxuICAgICAgICAgIHBhdGg6IFwiY29tbXVuaXR5L1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcInNyYy9mZWF0dXJlcy9wZXJzb25hbENlbnRlci9wYWdlc1wiLFxuICAgICAgICAgIHBhdGg6IFwicGVyc29uYWxDZW50ZXIvXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IFwic3JjL2ZlYXR1cmVzL2xvZ2luL3BhZ2VzXCIsXG4gICAgICAgICAgcGF0aDogXCJsb2dpbi9cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogXCJzcmMvZmVhdHVyZXMvYXBwbGljYXRpb24vcGFnZXNcIixcbiAgICAgICAgICBwYXRoOiBcImFwcGxpY2F0aW9uL1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcInNyYy9mZWF0dXJlcy9tZXNzYWdlL3BhZ2VzXCIsXG4gICAgICAgICAgcGF0aDogXCJtZXNzYWdlL1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcInNyYy9mZWF0dXJlcy9wb3N0L3BhZ2VzXCIsXG4gICAgICAgICAgcGF0aDogXCJwb3N0L1wiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgICBWdWUoKSxcbiAgICAvLyB2aXRlSW1hZ2VtaW4oe1xuICAgIC8vICAgZ2lmc2ljbGU6IHtcbiAgICAvLyAgICAgaW50ZXJsYWNlZDogZmFsc2UsXG4gICAgLy8gICB9LFxuICAgIC8vICAgb3B0aXBuZzoge1xuICAgIC8vICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcbiAgICAvLyAgIH0sXG4gICAgLy8gICBtb3pqcGVnOiB7XG4gICAgLy8gICAgIHByb2dyZXNzaXZlOiB0cnVlLFxuICAgIC8vICAgICBxdWFsaXR5OiA2NSxcbiAgICAvLyAgIH0sXG4gICAgLy8gICBwbmdxdWFudDoge1xuICAgIC8vICAgICBxdWFsaXR5OiBbMC42NSwgMC45XSxcbiAgICAvLyAgICAgc3BlZWQ6IDQsXG4gICAgLy8gICB9LFxuICAgIC8vICAgc3Znbzoge1xuICAgIC8vICAgICBwbHVnaW5zOiBbXG4gICAgLy8gICAgICAge1xuICAgIC8vICAgICAgICAgbmFtZTogXCJyZW1vdmVWaWV3Qm94XCIsXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICBuYW1lOiBcInJlbW92ZUVtcHR5QXR0cnNcIixcbiAgICAvLyAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgXSxcbiAgICAvLyAgIH0sXG4gICAgLy8gfSksXG4gIF0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCgpLCBhdXRvcHJlZml4ZXIoKV0sXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFwaTogXCJtb2Rlcm4tY29tcGlsZXJcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICBcIkBhZG1pblwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9hZG1pblwiKSxcbiAgICAgIFwiQGNvbW11bml0eVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9jb21tdW5pdHlcIiksXG4gICAgICBcIkBwZXJzb25hbENlbnRlclwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9wZXJzb25hbENlbnRlclwiKSxcbiAgICAgIFwiQGxvZ2luXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2ZlYXR1cmVzL2xvZ2luXCIpLFxuICAgICAgXCJAcG9zdFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9wb3N0XCIpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFQsT0FBTyxTQUFTO0FBQzlVLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGNBQWM7QUFDckIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsb0JBQW9CO0FBTDdCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGNBQWM7QUFBQTtBQUFBLFFBQzFDLFdBQVc7QUFBQTtBQUFBLE1BQ2I7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLFVBQVU7QUFBQTtBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLG1CQUFtQjtBQUFBLElBQ25CLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FBQyxPQUFPO0FBRXBCLGNBQUksR0FBRyxTQUFTLHFCQUFxQixHQUFHO0FBQ3RDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLHlDQUF5QyxHQUFHO0FBQzFELG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLFFBQVEsR0FBRztBQUN6QixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxxQkFBcUIsR0FBRztBQUN0QyxtQkFBTztB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
