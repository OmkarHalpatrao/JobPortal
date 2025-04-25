import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic' // ⬅️ Ensure it's using new JSX transform
    })
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
