const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// AuthBouncer

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:3010',
  changeOrigin: true,
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🔁 Proxy läuft auf http://localhost:${PORT}`);
});
