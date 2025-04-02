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
    port: 4200, // Puerto del servidor de Vite
    open: '/home.html',
    proxy: {
      '/camara': {
        target: 'http://192.168.2.192', // Asegúrate de que esta IP sea la correcta para tu ESP32-CAM
        changeOrigin: true,
        rewrite: path => path.replace(/^\/camara/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Agrega headers para evitar problemas de CORB/CORS
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            // Si presentas problemas de tipo de contenido, descomenta la siguiente línea:
            // proxyRes.headers['Content-Type'] = 'multipart/x-mixed-replace; boundary=--myboundary';
          });
        },
      },
    },
  },
});