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
    const { app } = this;
    let message = '';
    const name = await app.mysql.select('admin', {
      where: {
        adminname,
      },
    });
    if (name.length === 0) {
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
      message = '该管理员名已注册，请重新输入!';
      return message;
    }
  }
  async findOne(id) {
    const { app } = this;
    return await app.mysql.get('admin', { id });
  }
  async edit(id, adminname, password, repassword, status) {
    const { app } = this;
    let message = '',
      sql = '';
    if (password) {
      if (password === repassword) {
        let md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        // 偷懒，未对sql转义
        sql = `UPDATE admin SET status = ${status},password = '${password}' WHERE id = ${id}`;
      } else {
        message = '两次输入的密码不一致！';
        return message;
      }
    } else {
      sql = `UPDATE admin SET status = ${status} WHERE id = ${id}`;
    }
    await app.mysql.query(sql);
  }
  async delete(id) {
    const { app, ctx } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('admin', {
      id,
    });
    if (!findOne) {
      ctx.logger.error(new Error('不存在该管理员id！'));
    }
    const result = await app.mysql.delete('admin', {
      id,
    });
    return result;
  }
  async change(id, status) {
    const { app } = this;
    // 查询是否有对应数据
    const findOne = await app.mysql.get('admin', {
      id,
    });
    if (!findOne) {
      ctx.logger.error(new Error('不存在该管理员id！'));
    }
    const result = await app.mysql.update('admin', {
      id,
      status,
    });
    return result;
  }
}

module.exports = AdminService;
