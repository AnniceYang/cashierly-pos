import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: "mock",
        localEnabled: command === "serve",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    css: {
      postcss: path.resolve(__dirname, "postcss.config.cjs"),
    },
  };
});
