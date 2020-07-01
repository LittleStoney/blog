'use strict';

const Service = require('egg').Service;
const xss = require('xss');

class HomeService extends Service {
  async findAll(search, start, end) {
    const { app } = this;
    const blogs = await app.mysql.query(`
    SELECT * FROM blogs
    WHERE title LIKE ? 
    ORDER BY id DESC
    LIMIT ?, ?`,
    [`%${search}%`, start, end]
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
  async listBlogs(listSearch) {
    const { app } = this;
    const blogs = await app.mysql.query(`
    SELECT * FROM blogs
     WHERE cid LIKE ? 
     ORDER BY id DESC
    `, [`%${listSearch}%`]);
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
      },
      status: 1,
      orders: [['id', 'desc']],
    });
  }
  async queryReply(id) {
    const { app } = this;
    return await app.mysql.select('reply', {
      where: {
        blog_id: id,
      },
      status: 1,
    });
  }
  async updateClick(id) {
    const { app } = this;
    await app.mysql.query(`UPDATE blogs SET click = click + 1 WHERE id = ${id}`);
  }
  async comment(id, name, comment, time, face) {
    const { app } = this;
    name = xss(name);
    comment = xss(comment);
    return await app.mysql.insert('comment', {
      blog_id: id,
      name,
      content: comment,
      face,
      time,
      status: 1,
    });
  }
  async updateComment(blog_id) {
    const { app } = this;
    await app.mysql.query(`UPDATE blogs SET comment = comment + 1 WHERE id = ${blog_id}`);
  }
  async replyComment(user_id, blog_id, replyname, replycomment, replytime, replyface) {
    const { app } = this;
    replyname = xss(replyname);
    replycomment = xss(replycomment);
    return await app.mysql.query(`
    INSERT INTO reply 
    (name,content,time,status,reply_id,blog_id,face)
     VALUES (?,?,?,?,?,?,?)`,
    [replyname, replycomment, replytime, 1, user_id, blog_id, replyface]);
  }
}

module.exports = HomeService;
