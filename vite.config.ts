import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        input: {
          // Define the entry points for the extension
          background: "./background.html",
          popup: "./popup.html", // Ensure your popup HTML is included
          // Add more entry points if needed
        },
        output: {
          chunkFileNames: "assets/chunk-[hash].js",
        },
      },
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "src/manifest.json",
            dest: ".",
          },
        ],
      }),
    ],
    resolve: {
      alias: [
        {
          find: "@app",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ],
    },
  };
});
