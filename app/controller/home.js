'use strict';

const fs = require('fs');
const moment = require('moment');
const xss = require('xss');
const webConfigData = fs.readFileSync(__dirname + '/../../config/config.system.json');
const webConfig = JSON.parse(webConfigData.toString());
const redis = require('../lib/redis');
const redisClient = redis.getRedisClient();

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 首页
  async index() {
    const { ctx } = this;
    const currentPage = ctx.request.query.page || 1;
    const start = (currentPage - 1) * 6;
    const end = 6;
    const search = ctx.request.query.search || '';
    const blogs = await ctx.service.home.findAll(search, start, end);
    let num = await ctx.service.home.count();
    const lists = await ctx.service.home.lists();
    num = num[0].num;
    const totalPage = Math.ceil(num / 6);
    for (const item of blogs) {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    }
    await ctx.render('home/index.html', {
      webConfig,
      blogs,
      totalPage,
      currentPage,
      lists,
      search,
    });
  }
  // 分类页
  async list() {
    const { ctx } = this;
    const lists = await ctx.service.home.lists();
    const blogs = await ctx.service.home.listBlogs();
    blogs.forEach(item => {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    });
    await ctx.render('home/list.html', {
      webConfig,
      lists,
      blogs,
    });
  }
  // ajax搜索分类
  async ajaxList() {
    const { ctx } = this;
    const cid = ctx.query.cid;
    const blogs = await ctx.service.home.listBlogs(cid);
    blogs.forEach(item => {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    });
    ctx.ajaxSuccess(200, blogs);
  }
  // 文章页
  async article() {
    const { ctx } = this;
    const id = ctx.params.id;
    try {
      const queryBlog = ctx.service.home.queryBlog(id);
      const queryList = ctx.service.home.queryList(id);
      let comments = [],
        replies = [];
      // 评论和回复先查redis，没有再读数据库
      const commentRedis = await redisClient.zrevrange('comments', 0, -1);
      const replyRedis = await redisClient.zrange('replies', 0, -1);
      if (commentRedis.length && replyRedis.length) {
        console.info('读取redis缓存');
        commentRedis.forEach(item => {
          const ele = item.split('-');
          comments.push({
            blog_id: +ele[0],
            content: ele[1],
            time: ele[2],
            name: ele[3],
            face: ele[4],
            id: +ele[5],
          });
        });
        replyRedis.forEach(item => {
          const ele = item.split('-');
          replies.push({
            blog_id: +ele[0],
            content: ele[1],
            time: ele[2],
            name: ele[3],
            face: ele[4],
            reply_id: +ele[5],
            reply_name: ele[6],
            id: +ele[7],
          });
        });
      } else {
        console.info('读取评论直接读取mysql');
        comments = await ctx.service.home.queryComments(id);
        replies = await ctx.service.home.queryReply(id);
        comments.forEach(comment => {
          redisClient.zadd('comments', comment.id,
            `${comment.blog_id}-${comment.content}-${comment.time}-${comment.name}-${comment.face}-${comment.id}`);
        });
        replies.forEach(reply => {
          redisClient.zadd('replies', reply.id,
            `${reply.blog_id}-${reply.content}-${reply.time}-${reply.name}-${reply.face}-${reply.reply_id}-${reply.reply_name}-${reply.id}`);
        });
        redisClient.expire('comments', 60 * 60 * 24 * 7);
        redisClient.expire('replies', 60 * 60 * 24 * 7);
      }
      const updateClick = ctx.service.home.updateClick(id);
      const [blog, list] = await Promise.all([queryBlog, queryList, updateClick]);
      blog.time = moment(blog.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
      await ctx.render('home/article.html', {
        webConfig,
        blog,
        list,
        comments,
        replies,
      });
    } catch (error) {
      ctx.logger.error(error.message);
      ctx.status = 404;
      await ctx.render('404.html');
    }
  }
  // 处理评论
  async comment() {
    const { ctx } = this;
    const id = ctx.params.id;
    let { name, content, time, face } = ctx.request.body;
    name = xss(name);
    content = xss(content);
    const { affectedRows } = await ctx.service.home.comment(id, name, content, time, face);
    await ctx.service.home.updateComment(id);
    if (affectedRows !== 1) {
      ctx.ajaxFailed(500, '评论失败');
      return false;
    }
    // 原评论缓存全部设置过期
    redisClient.expire('comments', 0);
    ctx.ajaxSuccess(200, {
      name,
      content,
      time,
      face,
    });
  }
  // 处理回复
  async reply() {
    const { ctx } = this;
    const user_id = ctx.request.query.id;
    const blog_id = ctx.request.query.blog_id;
    let { name, content, time, face, reply_name } = ctx.request.body;
    name = xss(name);
    content = xss(content);
    const { affectedRows } = await ctx.service.home.replyComment(user_id, blog_id, name, content, time, face, reply_name);
    await ctx.service.home.updateComment(blog_id);
    if (affectedRows !== 1) {
      ctx.ajaxFailed(500, '回复失败');
      return false;
    }
    redisClient.expire('replies', 0);
    ctx.ajaxSuccess(200, {
      replyname: name,
      replycomment: content,
      replytime: time,
      replyface: face,
      reply_name,
    });
  }
}

module.exports = HomeController;
