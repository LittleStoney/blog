'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class LoginService extends Service {
  async index(adminname, password) {
    const { app } = this;
    const md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    const checkName = await app.mysql.get('admin', {
      adminname,
      status: 0,
    });
    if (!checkName) {
      throw new Error('登陆失败，用户名不存在');
    }
    const checkPass = await app.mysql.get('admin', {
      adminname,
      password,
      status: 0,
    });
    if (!checkPass) {
      throw new Error('登陆失败，密码错误');
    } else {
      return '登陆成功';
    }
  }
}

module.exports = LoginService;
