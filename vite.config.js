import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Alias para Firebase
      'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
      'firebase/messaging': path.resolve(__dirname, 'node_modules/firebase/messaging'),
    },
  },
  server: {
    port: 8080, // Puerto del servidor
  },
});