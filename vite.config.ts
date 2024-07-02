import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'

import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },

    plugins: [crx({ manifest }), react()],
    resolve: {
      alias: [{ find: '@app', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
    },
  }
})
