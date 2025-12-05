import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/admin/platform": {
                // target: 'https://beniocean.com/api',
                target: "http://192.168.1.100:8080/api",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/admin\/platform/, "/admin/platform"),
            },
            "/admin/merchant": {
                // target: 'https://beniocean.com/api',
                target: "http://192.168.1.100:8080/api",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/admin\/merchant/, "/admin/merchant"),
            },
        },
    },
});
