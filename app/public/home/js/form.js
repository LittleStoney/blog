/* eslint-disable object-shorthand */

'use strict';

// 去除空格
var inputs = document.querySelectorAll('input[type=text]');
inputs.forEach(function(item) {
  item.onkeyup = function() {
    this.value = this.value.trim();
  };
});
// 处理url信息
var htmlHref = window.location.href;
htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, '');
var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1);
var index = addr.lastIndexOf('\/');
var id = decodeURI(addr.substring(index + 1, addr.length));
// 保存用户名至localStorage
var username = localStorage.getItem('username');
if (username) {
  $('#name').val(username);
} else {
  $('#name').val('');
}
// 提交评论
$('#form').on('submit', function(e) {
  var name = $('input[name=name]').val(),
    content = $('#form-control').val(),
    face = $('select[name=face]').val();
  new PostComment(null, name, face, content).commentData();
  e.preventDefault();
  return false;
});


/**
 * 回复评论
 * @param {string} user_id id
 * @param {string} comment_id comment_id
 * @param {string} [reply_name] name
 */
function reply(user_id, comment_id, reply_name) {
  // 隐藏原评论框
  $('#form').css('display', 'none');
  $('.table form').css('display', 'none');
  // 显示回复评论框
  $('#' + user_id).show();
  // 提交回复
  $('#' + user_id).on('submit', function(e) {
    var name = $('#' + user_id + ' input[type=text]').val(),
      content = $('#' + user_id + ' .form-control').val(),
      face = $('#' + user_id + ' select[name=face]').val();
    new PostComment(comment_id, name, face, content).replyData(reply_name, user_id);
    e.preventDefault();
    return false;
  });
}
/**
 * 统一提交评论逻辑
 * @author shixtao <shixtao@qq.com> 2020-09-23
 * @param {string} [user_id] 用户id
 * @param {string} user_name 用户名
 * @param {string} face 用户头像
 * @param {string} content 评论内容
 */
function PostComment(user_id, user_name, face, content) {
  this.user_id = user_id || '';
  this.user_name = user_name.replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**');
  this.face = face;
  this.time = new Date().toLocaleString();
  this.content = content.replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**');
}
PostComment.prototype.validateData = function() {
  if (!this.content.replace(/ +/g, '').replace(/[\r\n]/g, '')) {
    alert('请输入内容！');
    return false;
  }
  return true;
};
PostComment.prototype.commentData = function() {
  if (!this.validateData()) {
    return false;
  }
  var that = this;
  $.ajax({
    type: 'POST',
    url: '/article/' + id,
    data: {
      name: that.user_name,
      content: that.content,
      time: that.time,
      face: that.face,
    },
    success(data) {
      if (data.status === 200) {
        localStorage.setItem('username', that.user_name);
        var content = '<tr><td><div class="touxiang"><img src="'.concat(data.message.face, '" alt="\u4EBA\u7269\u5934\u50CF" width="50" height="50"><div>').concat(data.message.name, '</div></div><div class="content">').concat(data.message.content, '<br><small>')
          .concat(data.message.time, '</small></div></td></tr>');
        // 成功通知
        $('.toast').toast('show');
        $('.table tbody').prepend(content);
        $('#form-control').val('');
        $('input[name=name]').val('');
      } else {
        alert('非法错误！');
        return false;
      }
    },
    error(error) {
      alert('非法错误！' + error.toString());
      return false;
    },
  });
};
PostComment.prototype.replyData = function(reply_name, user_id) {
  if (!this.validateData()) {
    return false;
  }
  var that = this;
  $.ajax({
    type: 'POST',
    url: '/reply?id=' + that.user_id + '&blog_id=' + id,
    data: {
      name: that.user_name,
      content: that.content,
      time: that.time,
      face: that.face,
      reply_name: reply_name,
    },
    success(data) {
      if (data.status === 200) {
        $('#' + that.user_id).parent().append('<div class="hf"><div class="reply_area"><span class="reply_info"><img src="'.concat(data.message.replyface, '" alt="\u4EBA\u7269\u5934\u50CF" width="50" height="50"> <span>').concat(data.message.replyname, '<span class="text-info">&nbsp;\u56DE\u590D&nbsp;</span><span></span>').concat(reply_name, ':</span></span><span class="reply_content">')
          .concat(data.message.replycomment, '<br><small>')
          .concat(data.message.replytime, '</small></span></div></div>'));
        $('.toast').toast('show');
        $('#' + user_id + 'reply').val('');
        $('#' + user_id + 'name').val('');
        $('#' + user_id).hide();
      } else {
        alert('非法错误！');
        return false;
      }
    },
    error(error) {
      alert('非法错误！' + error.toString());
      return false;
    },
  });
};
