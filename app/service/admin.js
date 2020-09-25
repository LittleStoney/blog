'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');

class AdminService extends Service {
  async findAll(search) {
    const { app } = this;
    const rows = await app.mysql.query('SELECT * FROM admin WHERE adminname LIKE ? ORDER BY id DESC', [ `%${search}%` ]);
    rows.forEach(item => {
      item.time = moment(item.time * 1000).format('YYYY年MM月DD日 HH:mm:ss');
    });
    return rows;
  }
  async add(adminname, password) {
    const { app, ctx } = this;
    const hasName = await app.mysql.select('admin', {
      where: {
        adminname,
      },
    });
    if (hasName.length === 0) {
      const time = Math.trunc((new Date().getTime()) / 1000);
      const md5 = crypto.createHash('md5');
      password = md5.update(password).digest('hex');
      await app.mysql.insert('admin',
        {
          adminname,
          password,
          status: 0,
          time,
        });
    } else {
      ctx.logger.error(new Error('管理员名称已存在！'));
      throw new Error('管理员名称已存在！');
    }
  }
  /**
   * 查询管理员是否存在
   * @async
   * @param {number} id 管理员id
   * @return {Promise<{id:number,adminname:string,password:string,status:number,time:number}>} 管理员数据
   */
  async findOne(id) {
    const { app } = this;
    return await app.mysql.get('admin', { id });
  }
  async edit(id, adminname, password, repassword, status) {
    const { app, ctx } = this;
    const row = {
      id,
      status,
    };
    if (repassword) {
      if (password === repassword) {
        let md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        // 修改了密码
        row.password = password;
      } else {
        ctx.logger.error(new Error('两次输入的密码不一致！'));
        throw new Error('两次输入的密码不一致！');
      }
    }
    await app.mysql.update('admin', row);
  }
  async delete(id) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await ctx.service.admin.findOne(id);
    if (!findOne) {
      ctx.logger.error(new Error('不存在该管理员！'));
      throw new Error('不存在该管理员！');
    }
    await app.mysql.delete('admin', {
      id,
    });
  }
  async change(id, status) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await ctx.service.admin.findOne(id);
    if (!findOne) {
      ctx.logger.error(new Error('不存在该管理员！'));
      throw new Error('不存在该管理员！');
    }
    await app.mysql.update('admin', {
      id,
      status,
    });
  }
}

module.exports = AdminService;
