$(function () {
	//点击切换颜色按钮
	$('#config-trigger').click(function (e) {
		e.preventDefault()
		if ($(this).hasClass('config-panel-open')) {
			$("#config-panel").animate({
				right: "-=190"
			}, 500)
			$(this).removeClass('config-panel-open').addClass('config-panel-hide')
		}
		else {
			$("#config-panel").animate({
				right: "+=190"
			}, 500);
			$(this).removeClass('config-panel-hide').addClass('config-panel-open')
		}
	})
	$('#config-close').on('click', function (e) {
		e.preventDefault()
		$('#config-trigger').click()
	})
	//点击选择颜色
	$('.theme-1 a').on('click', function () {
		var $listItem = $(this).closest('li')
		$listItem.addClass('active')
		$listItem.siblings().removeClass('active')
		$('.header').css('backgroundColor', '#5ECCA9')
		$('.nav-link').css('backgroundColor', '#5ECCA9')
		$('.more-link').css('color', '#5ECCA9')
		$('.list-inline-item a').css('color', '#5ECCA9')
		$('.btn-primary').css({
			'backgroundColor': '#5ECCA9',
			'borderColor': '#5ECCA9'
		})
		localStorage.setItem('color', '#5ECCA9')
	})
	$('.theme-2 a').on('click', function () {
		var $listItem = $(this).closest('li')
		$listItem.addClass('active')
		$listItem.siblings().removeClass('active')
		$('.header').css('backgroundColor', '#3B7EEB')
		$('.nav-link').css('backgroundColor', '#3B7EEB')
		$('.more-link').css('color', '#3B7EEB')
		$('.list-inline-item a').css('color', '#3B7EEB')
		$('.btn-primary').css({
			'backgroundColor': '#3B7EEB',
			'borderColor': '#3B7EEB'
		})
		localStorage.setItem('color', '#3B7EEB')
	})
	$('.theme-3 a').on('click', function () {
		var $listItem = $(this).closest('li')
		$listItem.addClass('active')
		$listItem.siblings().removeClass('active')
		$('.header').css('backgroundColor', '#EEA73B')
		$('.nav-link').css('backgroundColor', '#EEA73B')
		$('.more-link').css('color', '#EEA73B')
		$('.list-inline-item a').css('color', '#EEA73B')
		$('.btn-primary').css({
			'backgroundColor': '#EEA73B',
			'borderColor': '#EEA73B'
		})
		localStorage.setItem('color', '#EEA73B')
	})
	$('.theme-4 a').on('click', function () {
		var $listItem = $(this).closest('li')
		$listItem.addClass('active')
		$listItem.siblings().removeClass('active')
		$('.header').css('backgroundColor', '#6C51A4')
		$('.nav-link').css('backgroundColor', '#6C51A4')
		$('.more-link').css('color', '#6C51A4')
		$('.list-inline-item a').css('color', '#6C51A4')
		$('.btn-primary').css({
			'backgroundColor': '#6C51A4',
			'borderColor': '#6C51A4'
		})
		localStorage.setItem('color', '#6C51A4')
	})
})


