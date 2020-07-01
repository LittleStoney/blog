'use strict';

const fs = require('fs');
const moment = require('moment');

const webConfigData = fs.readFileSync(__dirname + '/../../config/config.system.json');
const webConfig = JSON.parse(webConfigData.toString());

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 首页
  async index() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const start = (page - 1) * 6;
    const end = 6;
    const search = ctx.request.query.search || '';
    const blogs = await ctx.service.home.findAll(search, start, end);
    let num = await ctx.service.home.count();
    const lists = await ctx.service.home.lists();
    num = num[0].num;
    const pageNum = Math.ceil(num / 6);
    for (const item of blogs) {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    }
    await ctx.render('home/index.html', {
      webConfig,
      blogs,
      pageNum,
      page,
      lists,
      search,
    });
  }
  // 分类页
  async list() {
    const { ctx } = this;
    const listSearch = ctx.request.query.listSearch ? ctx.request.query.listSearch : '';
    const lists = await ctx.service.home.lists();
    const blogs = await ctx.service.home.listBlogs(listSearch);
    blogs.forEach(item => {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    });
    await ctx.render('home/list.html', {
      webConfig,
      lists,
      blogs,
    });
  }
  // 文章页
  async article() {
    const { ctx } = this;
    const id = ctx.params.id;
    const queryBlog = ctx.service.home.queryBlog(id);
    const queryList = ctx.service.home.queryList(id);
    const queryComments = ctx.service.home.queryComments(id);
    const queryReply = ctx.service.home.queryReply(id);
    const updateClick = ctx.service.home.updateClick(id);
    const [blog, list, comments, replys ] = await Promise.all([queryBlog, queryList, queryComments, queryReply, updateClick]);
    blog.time = moment(blog.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    try {
      await ctx.render('home/article.html', {
        webConfig,
        blog,
        list,
        comments,
        replys,
      });
    } catch (error) {
      // 防止用户在url地址任意输入博客id
      ctx.status = 404;
      await ctx.render('404.html');
    }
  }
  // 处理评论
  async comment() {
    const { ctx } = this;
    const id = ctx.params.id;
    let { name, comment, time, face } = ctx.request.body;
    const { affectedRows } = await ctx.service.home.comment(id, name, comment, time, face);
    await ctx.service.home.updateComment(id);
    if (affectedRows !== 1) {
      ctx.ajaxFailed(500, '评论失败');
    } else {
      ctx.ajaxSuccess(200, {
        name,
        comment,
        time,
        face,
      });
    }
  }
  // 处理回复
  async reply() {
    const { ctx } = this;
    const user_id = ctx.request.query.id;
    const blog_id = ctx.request.query.blog_id;
    let { replyname, replycomment, replytime, replyface } = ctx.request.body;
    const { affectedRows } = await ctx.service.home.replyComment(user_id, blog_id, replyname, replycomment, replytime, replyface);
    await ctx.service.home.updateComment(blog_id);
    if (affectedRows !== 1) {
      ctx.ajaxFailed(500, '回复失败');
    } else {
      ctx.ajaxSuccess(200, {
        replyname,
        replycomment,
        replytime,
        replyface,
      });
    }
  }
}

module.exports = HomeController;
