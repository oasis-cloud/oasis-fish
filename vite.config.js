import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  server: {
    host: "0.0.0.0", // 允许通过 IP 访问
    port: 5173, // 默认端口
  },
  base: "/fish/", // 部署到 fish 子目录
  build: {
    outDir: "dist",
  },
});
