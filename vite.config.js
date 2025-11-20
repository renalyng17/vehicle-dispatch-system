// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // Add this import

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    nodePolyfills({ // Add the plugin here
      // Enable global polyfills
      globals: {
        process: true, // This is crucial for Google Maps
        Buffer: true,
      },
    }),
  ],
  
  // Keep your existing server configurations
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    },
    watch: {
      usePolling: true
    }
  },
  
  // Keep your existing build configurations
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  }
});