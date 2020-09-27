'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // 静态资源
  config.static = {
    gzip: true,
    maxAge: 1000 * 60 * 24 * 7,
    prefix: '/public/',
    buffer: false,
  };

  // https
  config.cluster = {
    https: {
      key: path.join(__dirname, './2_shixtao.cn.key'),
      cert: path.join(__dirname, '1_shixtao.cn_bundle.crt'),
    },
  };

  return config;
};
