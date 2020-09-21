'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.keys = 'shixtao@qq.com';

  config.middleware = [ 'notFound' ];

  // 添加 view 配置
  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
  };

  // MySql配置
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '13579asd',
      // 数据库名
      database: 'blog_egg',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // 取消post请求安全验证
  config.security = {
    csrf: false,
  };

  // 处理上传文件
  config.multipart = {
    mode: 'stream',
    //  POST /upload_file 使用file模式
    fileModeMatch: /\/upload_file$/,
  };

  // 静态资源
  config.static = {
    gzip: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    prefix: '/public',
  };

  // util
  config.customLoader = {
    lib: {
      directory: 'app/lib',
      inject: 'app',
    },
  };

  return config;
};
