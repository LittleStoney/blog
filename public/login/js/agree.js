$(function () {
	//保存密码
	var adminname = localStorage.getItem('adminname')
	var password = localStorage.getItem('password')
	if (adminname) {
		$('#admin').val(adminname)
	} else {
		$('#admin').val('')
	}
	if (password) {
		$('#pass').val(password)
		$('#radio').prop("checked", true)
	}
	//登录验证
	$('#form').on('submit', function () {
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
						var password = $('#pass').val()
						localStorage.setItem('adminname', adminname)
						if ($('#radio').is(':checked')) {
							localStorage.setItem('password', password)
						} else {
							localStorage.removeItem('password')
						}
						window.location.href = '/admin'
					default:
						break
				}
			},
			error: function (error) {
				console.log(error)
				return
			}
		})
		return false
	})
})
