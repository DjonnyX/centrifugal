module.exports = {
    "/*": {
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        }
    }
};