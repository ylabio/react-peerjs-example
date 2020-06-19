const isWeb = process.env.TARGET === 'web';

let config = {
  dev: {
    port: 8030,
  },

  api: {
    baseURL: isWeb ? '' : 'http://localhost:8130',
    tokenHeader: 'X-Token',

    proxy: {
      '/api/**': {
        target: 'http://example.com',
        secure: true,
        changeOrigin: true,
      },
    },
  },

  routing: {
    basename: '/',
    type: isWeb ? 'browser' : 'memory',
  },

  ssr: {
    host: 'localhost',
    port: 8130,
    preloadState: true,
  },

  peerJsServer: {
    host: '0.peerjs.com',
    port: 443,
    path: '/',
  },
};

module.exports = config;
