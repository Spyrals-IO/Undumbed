import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      name: 'Undumbed',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        // Exclure les dépendances externes ici si besoin
      ],
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false
  },
  plugins: [dts({
    insertTypesEntry: true,
    outDir: 'dist',
    include: ['index.ts', 'src/**/*'],
    exclude: ['test/**/*', 'vite.config.ts', 'vitest.config.ts']
  })],
}) 