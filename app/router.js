'use strict';
const ueditor = require('egg-ueditor');

module.exports = app => {
  // 前台
  require('./router/home')(app);
  // 后台
  require('./router/admin')(app);
  // ueditor
  app.all('/public/ueditor/ueditors', ueditor());
};
