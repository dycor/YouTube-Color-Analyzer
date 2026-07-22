import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

function excludeSourceArtwork(): Plugin {
  let outputDirectory = resolve(import.meta.dirname, 'dist')

  return {
    name: 'exclude-source-artwork',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      await rm(resolve(outputDirectory, 'icons/logo-master.png'), { force: true })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [excludeSourceArtwork()],
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
    sourcemap: mode === 'development',
    target: 'chrome116',
  },
}))
