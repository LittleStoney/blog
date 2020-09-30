'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app;
  const login = app.middleware.login();
  // 首页
  router.get('/admin', login, app.controller.admin.index);
  // 欢迎页
  router.get('/admin/welcome', login, app.controller.admin.welcome);
  // 登录页
  router.get('/admin/login', login, app.controller.admin.login);
  // 登录页处理
  router.post('/admin/check', login, app.controller.admin.check);
  // 退出登录
  router.get('/admin/logout', login, app.controller.admin.logout);
  // 博客分类管理页
  router.get('/admin/blogstype', app.controller.admin.blogLists);
  // 添加博客分类管理页
  router.get('/admin/blogstype/add', login, app.controller.admin.addBlogLists);
  // post添加博客分类管理页
  router.post('/admin/blogstype/add', login, app.controller.admin.postAddBlogLists);
  // 修改博客分类管理页
  router.get('/admin/blogstype/edit', login, app.controller.admin.editBlogLists);
  // post修改博客分类管理页
  router.post('/admin/blogstype/edit', login, app.controller.admin.postEditBlogLists);
  // 删除博客分类
  router.get('/admin/blogstype/ajax_del', login, app.controller.admin.deleteBlogLists);
  // 博客管理页
  router.get('/admin/blogs', login, app.controller.admin.blogs);
  // 添加博客页
  router.get('/admin/blogs/add', login, app.controller.admin.addBlog);
  // post添加博客页
  router.post('/admin/blogs/add/upload_file', login, app.controller.admin.postAddBlog);
  // 修改博客页
  router.get('/admin/blogs/edit', login, app.controller.admin.editBlog);
  // post修改博客页
  router.post('/admin/blogs/edit/upload_file', login, app.controller.admin.postEditBlog);
  // 删除博客页
  router.get('/admin/blogs/ajax_delete', login, app.controller.admin.deleteBlog);
  // 管理员管理页
  router.get('/admin/admin', login, app.controller.admin.admin);
  // 添加管理员管理页
  router.get('/admin/admin/add', login, login, app.controller.admin.addAdmin);
  // post添加管理员页
  router.post('/admin/admin/add', login, app.controller.admin.postAddAdmin);
  // 修改管理员管理页
  router.get('/admin/admin/edit', login, app.controller.admin.editAdmin);
  // post修改管理员页
  router.post('/admin/admin/edit', login, app.controller.admin.postEditAdmin);
  // 删除管理员
  router.get('/admin/admin/ajax_del', login, app.controller.admin.deleteAdmin);
  // 修改管理员状态
  router.get('/admin/admin/ajax_status', login, app.controller.admin.changeStatus);
  // 评论管理页
  router.get('/admin/comment', login, app.controller.admin.comment);
  // 修改评论状态
  router.get('/admin/comment/ajax_status', login, app.controller.admin.editComment);
  // 系统管理页
  router.get('/admin/system', login, app.controller.admin.system);
  // post修改系统管理页
  router.post('/admin/system/upload_file', login, app.controller.admin.postSystem);
};
