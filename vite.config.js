import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import postcssPurgecss from "@fullhuman/postcss-purgecss";

export default defineConfig({
    plugins: [
        solidPlugin(),,
    ],
    build: {
        target: "esnext",
        polyfillDynamicImport: false,
    },
    css: {
        postcss: {
            plugins: [
                postcssPurgecss({
                    content: ['./src/App.jsx']
                })
            ]
        }
    }
});