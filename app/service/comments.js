'use strict';

const Service = require('egg').Service;

class CommentsService extends Service {
  async findComments(page) {
    const { app } = this;
    let size = 6;
    let total = await app.mysql.query(`
    SELECT COUNT(*) AS total
    FROM comment
    `);
    total = total[0].total;
    const fpage = app.lib.utils.pagess(total, page, size);
    const result = await app.mysql.query(`
    SELECT comment.*, blogs.title,blogs.img,blogs.id AS blogId
    FROM comment
    INNER JOIN blogs
    ON comment.blog_id = blogs.id
    ORDER BY comment.id DESC
    LIMIT ${fpage.start},${fpage.size}`);
    return {
      show: fpage.show,
      result,
    };
  }
  async findReplies() {
    const { app } = this;
    const result = await app.mysql.query(`
    SELECT reply.*
    FROM reply
    INNER JOIN comment
    ON comment.id = reply.reply_id
    ORDER BY reply.id DESC`);
    return {
      result,
    };
  }
  async edit(id, status) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('comment', {
      id,
    });
    if (!findOne) {
      ctx.logger.error(new Error('不存在该评论id！'));
      throw new Error('不存在该评论id！');
    }
    const result = await app.mysql.update('comment', {
      id,
      status,
    });
    return result;
  }
}

module.exports = CommentsService;
