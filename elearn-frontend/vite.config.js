import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    // Enable gzip compression in dev
    middlewareMode: false,
    // Optimize chunk size
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
  build: {
    // Optimize build output
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui';
            }
            if (id.includes('axios') || id.includes('framer-motion')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        },
        // Asset file names for cache busting
        assetFileNames: (assetInfo) => {
          const name = assetInfo?.name || '';
          const ext = name.includes('.') ? name.split('.').pop() : '';
          if (/png|jpg|jpeg|gif|svg|webp|ico/.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          } else if (ext === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Source maps only in development
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'axios',
      'framer-motion',
    ],
  },
})
