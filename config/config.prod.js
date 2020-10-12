'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // 静态资源
  config.static = {
    gzip: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    prefix: '/public/',
    buffer: false,
  };

  // https
  config.cluster = {
    https: {
      key: '/home/private.key',
      cert: '/home/fullchain.crt',
    },
  };

  // etag
  config.etag = {
    weak: false,
  };

  return config;
};
