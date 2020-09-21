'use strict';

module.exports = {

  /**
   *  扩展ctx.success()方法
   *  @param {string} [content] 需要返回给前端的alert内容
   *  @param {string} [handle] 后续操作
   */
  success(content = '', handle = '') {
    this.status = 200;
    this.body = `<script>alert('${content}');${handle}</script>`;
  },

  /**
   *  扩展ctx.failed()方法
   *  @param {string} content 需要返回给前端的alert内容
   *  @param {string} [handle] 后续操作，默认go(-1)
   */
  failed(content, handle = 'history.go(-1);') {
    this.status = 200;
    this.body = `<script>alert('${content}');${handle}</script>`;
  },

  /**
   *  扩展ctx.ajaxSuccess()方法
   *  @param {number} code 需要返回给前端HTTP Code，默认200
   *  @param {*} [message] 返回内容message
   */
  ajaxSuccess(code = 200, message) {
    this.status = code;
    this.body = {
      status: code,
      message,
    };
  },

  /**
   *  扩展ctx.ajaxFailed()方法
   *  @param {string} code 需要返回给前端HTTP Code，默认200
   *  @param {string} [message] 返回内容message
   */
  ajaxFailed(code = 200, message) {
    this.status = 200;
    this.body = {
      status: code,
      message,
    };
  },
};
