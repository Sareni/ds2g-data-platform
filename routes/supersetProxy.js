const httpProxy = require('http-proxy');
const { superset: supersetConfig } = require('../config/ds2g_data_platform_config');
const { getTrackingKey } = require('./utils');


const proxy = httpProxy.createProxyServer({
    target: {
        host: supersetConfig.host,
        port: supersetConfig.port,
        protocol: 'http'
      },
      ignorePath: true
});

function setIfExists(proxyReq, header, value){
    if(value){
        proxyReq.setHeader(header, encodeURIComponent(value));
    }
}

proxy.on('error', () => {
    console.log('Error connecting');
    console.log(e);
});
  
proxy.on('proxyReq', async (proxyReq, req, res, options) => { 
    console.log('proxyReq', proxyReq);
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('proxyRes', proxyRes);
});

proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => { });

module.exports = () => {
    return proxy;
}