'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class LoginService extends Service {
  async index(adminname, password) {
    const { app } = this;
    const md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    let message = '';
    const isName = await app.mysql.get('admin', {
      adminname,
      status: 0,
    });
    if (!isName) {
      message = '登陆失败，用户名不存在';
      return message;
    }
    const isPass = await app.mysql.get('admin', {
      adminname,
      password,
      status: 0,
    });
    if (!isPass) {
      message = '登陆失败，密码错误';
      return message;
    }
    message = '登陆成功';
    return message;
  }
}

module.exports = LoginService;
