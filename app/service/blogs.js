'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class BlogsService extends Service {
  async find(page) {
    const { app } = this;
    let size = 6;
    let total = await app.mysql.query(`
    SELECT COUNT(*) AS total
    FROM blogs
    `);
    total = total[0].total;
    const fpage = app.lib.utils.pagess(total, page, size);
    const rows = await app.mysql.query(`
    SELECT blogs.*,blogstype.name tname
    FROM blogs
    INNER JOIN blogstype
    ON blogs.cid = blogstype.id
    ORDER BY blogs.id DESC
    LIMIT ${fpage.start},${fpage.size}`);
    rows.forEach(element => {
      element.time = moment(element.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    });
    return {
      rows,
      show: fpage.show,
    };
  }
  async findTypes() {
    const { app } = this;
    const result = await app.mysql.select('blogstype', {
      orders: [[ 'id', 'desc' ]],
    });
    return result;
  }
  async postAdd(type, title, time, newPath, keywords, description, author, cid, top, content, click) {
    const { app } = this;
    await app.mysql.insert('blogs', {
      type, title, time, img: newPath, keywords, description, author, cid, top, content, click, comment: 0,
    });
  }
  async edit(id) {
    const { app } = this;
    const rows = await app.mysql.select('blogs', {
      where:
      {
        id,
      },
    });
    return rows[0];
  }
  async postEdit(id, type, title, keywords, description, img, author, cid, top, content) {
    const { app } = this;
    await app.mysql.update('blogs', {
      id,
      type,
      title,
      keywords,
      description,
      img,
      author,
      cid,
      top,
      content,
    });
  }
  async delete(id) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('blogs', {
      id,
    });
    if (!findOne) {
      ctx.logger.error(new Error('不存在该博客id！'));
      throw new Error('不存在该分类id！');
    }
    await app.mysql.beginTransactionScope(async conn => {
      await conn.delete('blogs', {
        id,
      });
      await conn.delete('comment', {
        blog_id: id,
      });
      await conn.delete('reply', {
        blog_id: id,
      });
      return { success: true };
    }, ctx);
  }
}

module.exports = BlogsService;
