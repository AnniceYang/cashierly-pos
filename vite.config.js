import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import path from "path"; // 这里要加

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: "mock", // mock 文件目录
        localEnabled: command === "serve", // 开发环境启用
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
