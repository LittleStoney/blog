'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app;
  const https = app.middleware.https();
  // 首页
  router.get('/', https, app.controller.home.index);
  // 分类页
  router.get('/list', app.controller.home.list);
  // ajax分类
  router.get('/ajax_list', app.controller.home.ajaxList);
  // 文章页
  router.get('/article/:id', app.controller.home.article);
  // 评论
  router.post('/article/:id', app.controller.home.comment);
  // 回复
  router.post('/reply', app.controller.home.reply);
};
