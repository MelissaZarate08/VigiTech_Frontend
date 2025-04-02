const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy para redirigir peticiones a la ESP32-CAM
app.use('/camara', createProxyMiddleware({
  target: 'http://192.168.2.192/', // Reemplaza con la IP de tu cámara
  changeOrigin: true,
  pathRewrite: { '^/camara': '' }, // Remueve el prefijo "/camara"
  onProxyRes: (proxyRes, req, res) => {
    // Agrega header para evitar problemas de CORS/CORB
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    // Si es necesario, forzar el Content-Type correcto:
    // proxyRes.headers['Content-Type'] = 'multipart/x-mixed-replace; boundary=--myboundary';
  }
}));

// Si deseas servir archivos estáticos (por ejemplo, tu HTML) desde este servidor:
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
