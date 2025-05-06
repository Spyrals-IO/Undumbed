import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      name: 'Undumbed',
      formats: ['es'],
      fileName: 'undumbed',
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
  })],
}) 