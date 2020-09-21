'use strict';

const Service = require('egg').Service;

class blogtypesService extends Service {
  async findAll() {
    const { app } = this;
    const rows = await app.mysql.select('blogstype', {
      orders: [[ 'id', 'desc' ]],
    });
    return rows;
  }
  async find(id) {
    const { app } = this;
    const rows = await app.mysql.select('blogstype', {
      where:
      {
        id,
      },
    });
    return rows[0];
  }
  async add(name, sort) {
    const { app, ctx } = this;
    // 查询是否有相同的分类名称
    const hasName = await app.mysql.get('blogstype', {
      name,
    });
    if (hasName) {
      ctx.logger.error(new Error('添加失败，存在相同的分类名称！'));
      throw new Error('添加失败，存在相同的分类名称！');
    }
    await app.mysql.insert('blogstype', {
      name,
      sort,
    });
  }
  async edit(name, sort, id) {
    const { app } = this;
    // 查询是否有相同的分类名称
    const hasName = await app.mysql.get('blogstype', {
      name,
    });
    if (hasName) {
      throw new Error('修改失败，存在相同的分类名称！');
    }
    await app.mysql.update('blogstype', {
      name,
      sort,
      id,
    });
  }
  async delete(id) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('blogstype', {
      id,
    });
    if (!findOne) {
      ctx.logger.error(new Error('不存在该分类id！'));
    }
    // 查询是否有博客正在使用该分类
    const findBlog = await app.mysql.get('blogs', {
      cid: id,
    });
    if (findBlog) {
      ctx.logger.error(new Error('当前有博客正在使用该分类，不允许删除！'));
      throw new Error('当前有博客正在使用该分类，不允许删除！');
    }
    const result = await app.mysql.delete('blogstype', {
      id,
    });
    return result;
  }
}

module.exports = blogtypesService;
