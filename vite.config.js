import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss"

export default defineConfig({
    root: "frontend",
    plugins: [
        solidPlugin(),
        WindiCSS({
            scan: {
                fileExtensions: ["html", "js", "ts", "jsx", "tsx"]
            },
        })
    ],
    build: {
        target: "esnext",
        outDir: "../dist"
    },
});