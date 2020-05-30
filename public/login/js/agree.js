'use strict'
$(function () {
	//保存用户名
	var adminname = localStorage.getItem('adminname')
	if (adminname) {
		$('#admin').val(adminname)
	} else {
		$('#admin').val('')
	}
	//登录验证
	$('#form').on('submit', function (e) {
		// 禁止重复提交
		$('.log-btn').prop('disabled', true)
		$.ajax({
			type: 'POST',
			url: '/admin/check',
			data: $(this).serialize(),
			success: function (data) {
				switch (data) {
					case 'Noname':
						$('.name').removeClass('hide')
						$('#admin').focus(function () {
							$('.name').addClass('hide')
						})
						break
					case 'Nopass':
						$('.pass').removeClass('hide')
						$('#pass').focus(function () {
							$('.pass').addClass('hide')
						})
						break
					case 'ok':
						var adminname = $('#admin').val()
						localStorage.setItem('adminname', adminname)
						window.location.href = '/admin'
					default:
						break
				}
			},
			error: function (error) {
				// 出错直接返回首页
				location.href = '/'
				return false
			}
		})
		e.preventDefault()
		return false
	})
})
