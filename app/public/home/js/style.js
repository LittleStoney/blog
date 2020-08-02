'use strict';

$(function() {
  // 检测webp
  function checkWebp(img) {
    var webImg = new Image();
    webImg.src =
      'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    webImg.onload = function() {
      var result = webImg.width > 0 && webImg.height > 0;
      if (!result) {
        img.src = '/public/home/images/win10狗头.jpg';
      }
    };
    webImg.onerror = function() {
      img.src = '/public/home/images/win10狗头.jpg';
    };
  }
  checkWebp(document.querySelector('.profile-image'));

  // 点击切换颜色按钮
  $('#config-trigger').click(function(e) {
    e.preventDefault();
    if ($(this).hasClass('config-panel-open')) {
      $('#config-panel').animate({
        right: '-=190',
      }, 500);
      $(this).removeClass('config-panel-open').addClass('config-panel-hide');
    } else {
      $('#config-panel').animate({
        right: '+=190',
      }, 500);
      $(this).removeClass('config-panel-hide').addClass('config-panel-open');
    }
  });
  $('#config-close').on('click', function(e) {
    e.preventDefault();
    $('#config-trigger').click();
  });

  // 点击选择颜色
  var colors = [	// 颜色数组
    '#5ecca9',
    '#3b7eeb',
    '#eea73b',
    '#6c51a4',
  ];
  // 切换皮肤
  var cureentColor = localStorage.getItem('color'),
    $listLnlineItem = $('#color-options .list-inline-item');
  $listLnlineItem.click(function() {
    $(this).addClass('active').siblings()
      .removeClass('active');
    var currentIndex = $(this).index(),
      resultColor;
    resultColor = colors[currentIndex];
    $('.header').css('backgroundColor', resultColor);
    $('.nav-link').css('backgroundColor', resultColor);
    $('.more-link').css('color', resultColor);
    $('.list-inline-item a').css('color', resultColor);
    $('.btn-primary').css({
      backgroundColor: resultColor,
      borderColor: resultColor,
    });
    localStorage.setItem('color', resultColor);
  });
  // 遍历存储色
  switch (cureentColor) {
    case colors[0]:
      $listLnlineItem.eq(0).addClass('active');
      break;
    case colors[1]:
      $listLnlineItem.eq(1).addClass('active');
      break;
    case colors[2]:
      $listLnlineItem.eq(2).addClass('active');
      break;
    case colors[3]:
      $listLnlineItem.eq(3).addClass('active');
      break;
    default:
      $listLnlineItem.eq(0).addClass('active');
      break;
  }

  // 动态logo
  var $logo = $('.logo'),
    logoArr = Array.prototype.slice.call($logo.text());
  logoArr.reduce(function(pre, cur, index) {
    pre === index && $logo.html('');
    var span = document.createElement('span');
    var $span = $(span);
    $span.html(cur);
    $logo.append($span);
    $span.on('mouseover', function() {
      $(this).addClass('color');
    });
    $span.on('animationend', function() {
      $(this).removeClass('color');
    });
  }, 0);

  // 回到顶部
  var windowTop = $(window).height();
  var $back = $('.top');
  $(document).on('scroll', function() {
    if ($(document).scrollTop() >= windowTop / 2) {
      $back.fadeIn();
    } else {
      $back.fadeOut();
    }
  });
  $back.on('click', function() {
    $('body ,html').stop().animate({
      scrollTop: 0,
    });
  });

  // 懒加载内容
  var options = {
    threshold: 1,
    rootMargin: '0px',
  };
  function lazyLoad(index, target) {
    var io = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          var src = $(img).attr('data-src');
          $(img).attr('src', src);
          observer.disconnect();
        }
      });
    }, options);
    io.observe(target);
  }
  $('.item img').each(lazyLoad);
});

