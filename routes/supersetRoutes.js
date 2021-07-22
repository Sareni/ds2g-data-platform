
const requireLogin = require('../middlewares/requireLogin');
//const proxy = require('./supersetProxy')();
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
    target: 'https://superset.ds2g.io:443/login/ownauth',
    changeOrigin: true,
    ignorePath: true
});
proxy.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

proxy.on('proxyRes', (proxyRes, req, res) => {
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
});

module.exports = (app) => {
    // CSRF TOKEN-cookie doesnt get proxied...
    app.get('/api/reports', requireLogin, async (req, res) => {
        proxy.web(req, res); //https://superset.ds2g.io:443/login/auth0
    });
}