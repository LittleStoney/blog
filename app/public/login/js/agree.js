/* eslint-disable no-var */
'use strict';

$(function() {
  // 保存用户名
  var adminname = localStorage.getItem('adminname');
  if (adminname) {
    $('#admin').val(adminname);
  } else {
    $('#admin').val('');
  }
  // 登录验证
  $('#form').on('submit', function(e) {
    $.ajax({
      type: 'POST',
      url: '/admin/check',
      data: $(this).serialize(),
      success(data) {
        if (data.status === 200 && data.message === '登陆成功') {
          var adminname = $('#admin').val();
          localStorage.setItem('adminname', adminname);
          window.location.href = '/admin';
        } else {
          $('#pass').after('<span class="name-warn pass"><em>' + data.message + '</em><i class="icon-warn"></i></span>');
          $('#admin').focus(function() {
            $('.pass').addClass('hide');
          });
          $('#pass').focus(function() {
            $('.pass').addClass('hide');
          });
        }
      },
      error(error) {
        // 出错直接返回首页
        location.href = '/';
        return false;
      },
    });
    e.preventDefault();
    return false;
  });
});
