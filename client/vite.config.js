import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Esto asegura que el Dockerfile encuentre la carpeta 'dist'
    outDir: 'dist',
  }
})