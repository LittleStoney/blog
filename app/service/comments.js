'use strict';

const Service = require('egg').Service;

class CommentsService extends Service {
  async find(page) {
    const { app } = this;
    let size = 6;
    let total = await app.mysql.query(`
    SELECT COUNT(*) AS total
    FROM comment
    `);
    total = total[0].total;
    const fpage = app.lib.utils.pagess(total, page, size);
    const result = await app.mysql.query(`
    SELECT comment.*, blogs.title,blogs.img
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
  async edit(id, status) {
    const { app } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('comment', {
      id,
    });
    if (!findOne) {
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
