const isWeb = process.env.TARGET === 'web';

let config = {
  dev: {
    port: 8030,
  },
  api: {
    baseURL: isWeb ? '' : 'http://localhost:8102',
    tokenHeader: 'X-Token',

    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
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
};

module.exports = config;
