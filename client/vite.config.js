import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    rollupNodePolyFill() // Add this to polyfill global, setImmediate, etc.
  ],
  resolve: {
    alias: {
      global: 'globalthis', // Alias for global
    }
  },
  define: {
    global: 'globalThis', // Define it for use in packages like fbjs
  },
  optimizeDeps: {
    include: ['buffer', 'process'] // Optional for future needs
  }
})
