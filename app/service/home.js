'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async findAll(search, start, end) {
    const { app } = this;
    const blogs = await app.mysql.query(`
    SELECT * FROM blogs
    WHERE title LIKE ? 
    ORDER BY top DESC,id DESC
    LIMIT ?, ?`,
    [ `%${search}%`, start, end ]
    );
    return blogs;
  }
  async count() {
    const { app } = this;
    const num = await app.mysql.query('SELECT COUNT(*) AS num FROM blogs');
    return num;
  }
  async lists() {
    const { app } = this;
    const lists = await app.mysql.select('blogstype');
    return lists;
  }
  async listBlogs(cid) {
    const { app } = this;
    let where;
    if (cid) {
      where = {
        cid,
      };
    }
    const blogs = await app.mysql.select('blogs', {
      where,
      orders: [[ 'id', 'desc' ]],
    });
    return blogs;
  }
  async queryBlog(id) {
    const { app } = this;
    const res = await app.mysql.select('blogs', {
      where: {
        id,
      },
    });
    return res[0];
  }
  async queryList(id) {
    const { app } = this;
    const res = await app.mysql.query(`
    SELECT blogstype.name,blogs.id
    FROM blogs,blogstype
    WHERE blogs.cid = blogstype.id
    AND blogs.id = ${id}
    `);
    return res[0];
  }
  async queryComments(id) {
    const { app } = this;
    return await app.mysql.select('comment', {
      where: {
        blog_id: id,
        status: 1,
      },
      orders: [[ 'id', 'desc' ]],
    });
  }
  async queryReply(id) {
    const { app } = this;
    return await app.mysql.select('reply', {
      where: {
        blog_id: id,
        status: 1,
      },
    });
  }
  async updateClick(id) {
    const { app } = this;
    await app.mysql.query(`UPDATE blogs SET click = click + 1 WHERE id = ${id}`);
  }
  async comment(id, name, content, time, face) {
    const { app } = this;
    return await app.mysql.insert('comment', {
      blog_id: id,
      name,
      content,
      face,
      time,
      status: 1,
    });
  }
  async updateComment(blog_id) {
    const { app } = this;
    await app.mysql.query(`UPDATE blogs SET comment = comment + 1 WHERE id = ${blog_id}`);
  }
  async replyComment(user_id, blog_id, name, content, time, face, reply_name) {
    const { app } = this;
    return await app.mysql.insert('reply',
      {
        name,
        content,
        time,
        status: 1,
        reply_id: user_id,
        blog_id,
        face,
        reply_name,
      }
    );
  }
}

module.exports = HomeService;
