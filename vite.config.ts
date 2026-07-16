import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(import.meta.dirname, 'sidepanel.html'),
        offscreen: resolve(import.meta.dirname, 'offscreen.html'),
        'service-worker': resolve(import.meta.dirname, 'src/service-worker/index.ts'),
        'content-script': resolve(import.meta.dirname, 'src/content-script/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    sourcemap: true,
    target: 'chrome116',
  },
})

