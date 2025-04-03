import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
      'firebase/messaging': path.resolve(__dirname, 'node_modules/firebase/messaging'),
    },
  },
  server: {
    port: 4200, 
    open: '/home.html',
    proxy: {
      '/camara': {
        target: 'http://192.168.2.192', 
        changeOrigin: true,
        rewrite: path => path.replace(/^\/camara/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        },
      },
    },
  },
});