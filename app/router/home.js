'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app;
  // 首页
  router.get('/', app.controller.home.index);
  // 分类页
  router.get('/list', app.controller.home.list);
  // 文章页
  router.get('/article/:id', app.controller.home.article);
  // 评论
  router.post('/article/:id', app.controller.home.comment);
  // 回复
  router.post('/reply', app.controller.home.reply);
};
