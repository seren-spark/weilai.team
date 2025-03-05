// vite.config.ts
import Vue from "file:///E:/weilai/weilai.team/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import autoprefixer from "file:///E:/weilai/weilai.team/node_modules/autoprefixer/lib/autoprefixer.js";
import { resolve } from "node:path";
import tailwind from "file:///E:/weilai/weilai.team/node_modules/tailwindcss/lib/index.js";
import VueRouter from "file:///E:/weilai/weilai.team/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig } from "file:///E:/weilai/weilai.team/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "E:\\weilai\\weilai.team";
var vite_config_default = defineConfig({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3ZWlsYWlcXFxcd2VpbGFpLnRlYW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHdlaWxhaVxcXFx3ZWlsYWkudGVhbVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2VpbGFpL3dlaWxhaS50ZWFtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IFZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSBcImF1dG9wcmVmaXhlclwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XHJcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSBcInVucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBWdWVSb3V0ZXIoe1xyXG4gICAgICByb3V0ZXNGb2xkZXI6IFtcclxuICAgICAgICBcInNyYy9wYWdlc1wiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCJzcmMvZmVhdHVyZXMvYWRtaW4vcGFnZXNcIixcclxuICAgICAgICAgIHBhdGg6IFwiYWRtaW4vXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwic3JjL2ZlYXR1cmVzL2NvbW11bml0eS9wYWdlc1wiLFxyXG4gICAgICAgICAgcGF0aDogXCJjb21tdW5pdHkvXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwic3JjL2ZlYXR1cmVzL3BlcnNvbmFsQ2VudGVyL3BhZ2VzXCIsXHJcbiAgICAgICAgICBwYXRoOiBcInBlcnNvbmFsQ2VudGVyL1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcInNyYy9mZWF0dXJlcy9sb2dpbi9wYWdlc1wiLFxyXG4gICAgICAgICAgcGF0aDogXCJsb2dpbi9cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCJzcmMvZmVhdHVyZXMvYXBwbGljYXRpb24vcGFnZXNcIixcclxuICAgICAgICAgIHBhdGg6IFwiYXBwbGljYXRpb24vXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwic3JjL2ZlYXR1cmVzL21lc3NhZ2UvcGFnZXNcIixcclxuICAgICAgICAgIHBhdGg6IFwibWVzc2FnZS9cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCJzcmMvZmVhdHVyZXMvcG9zdC9wYWdlc1wiLFxyXG4gICAgICAgICAgcGF0aDogXCJwb3N0L1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICAgIFZ1ZSgpLFxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCgpLCBhdXRvcHJlZml4ZXIoKV0sXHJcbiAgICB9LFxyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYXBpOiBcIm1vZGVybi1jb21waWxlclwiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgXCJAYWRtaW5cIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvZmVhdHVyZXMvYWRtaW5cIiksXHJcbiAgICAgIFwiQGNvbW11bml0eVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9jb21tdW5pdHlcIiksXHJcbiAgICAgIFwiQHBlcnNvbmFsQ2VudGVyXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2ZlYXR1cmVzL3BlcnNvbmFsQ2VudGVyXCIpLFxyXG4gICAgICBcIkBsb2dpblwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9sb2dpblwiKSxcclxuICAgICAgXCJAcG9zdFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9mZWF0dXJlcy9wb3N0XCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UCxPQUFPLFNBQVM7QUFDdlEsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sY0FBYztBQUNyQixPQUFPLGVBQWU7QUFDdEIsU0FBUyxvQkFBb0I7QUFMN0IsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsY0FBYztBQUFBLFFBQ1o7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxFQUNOO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUFBLElBQ3RDO0FBQUEsSUFDQSxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQy9CLFVBQVUsUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxNQUNuRCxjQUFjLFFBQVEsa0NBQVcsMEJBQTBCO0FBQUEsTUFDM0QsbUJBQW1CLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsTUFDckUsVUFBVSxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBLE1BQ25ELFNBQVMsUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxJQUNuRDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
