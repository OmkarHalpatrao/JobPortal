import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic' // ⬅️ Ensure it's using new JSX transform
    }),tailwindcss()
  ],
  resolve: {
    alias: {
      global: 'globalThis'
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['buffer', 'process']
  }
})
