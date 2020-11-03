/* eslint-disable strict */

$(function() {

  // 颜色保存于localstorage中
  var colors = [
    '#5ecca9',
    '#3b7eeb',
    '#eea73b',
    '#6c51a4',
  ];
  var color = localStorage.getItem('color');
  if (color) {
    $('.header').css('backgroundColor', color);
    $('.nav-link').css('backgroundColor', color);
    $('.btn-primary').css({
      backgroundColor: color,
      borderColor: color,
    });
    $('.list-inline-item a').css('color', color);
    $('.more-link').css('color', color);
    var targetActive = 1;
    colors.forEach(function(item, index) {
      if (color === item) {
        targetActive = index + 1;
      }
    });
    $('.list-group-item').removeClass().addClass('list-group-item list-group-item-action mb-1 active' + targetActive);
  }
  // 点击选择颜色
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
    var targetActive = 'active' + (currentIndex + 1);
    $('.list-group-item').removeClass().addClass('list-group-item list-group-item-action mb-1 ' + targetActive);
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

  // url header li高亮
  var currenPage = location.href;
  if (currenPage.indexOf('hot') !== -1) {
    // 热门博客
    $('.navbar-nav > .nav-item:nth-child(2)').addClass('active');
  } else if (currenPage.indexOf('list') !== -1) {
    // 分类
    $('.navbar-nav > .nav-item:nth-child(3)').addClass('active');
  } else {
    $('.navbar-nav > .nav-item:nth-child(1)').addClass('active');
  }

  // url search
  var searchContent = location.search;
  if (searchContent && searchContent.indexOf('?search') !== -1) {
    var search = decodeURIComponent(searchContent.split('?search=')[1]);
    if ($('.title a').length !== 0) {
      $('.title a').each(function(index, ele) {
        // ele is a HTMLElement
        var title = $(ele).html();
        var reg = new RegExp(search, 'gi');
        var newSearchContent = title.match(reg);
        var newTitle = newSearchContent.reduce(function(total, cur) {
          return total.replace(cur, '<mark class="highlightTitle">' + cur + '</mark>');
        }, title);
        $(ele).html(newTitle);
      });
    } else {
      $('.blog-list > .container').text('空空如也，世界变得清净了~');
    }
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
  if (typeof IntersectionObserver !== 'function') {
    var listImgsSrc = $('.img-list');
    listImgsSrc.each(function() {
      var imgSrc = this.getAttribute('data-src');
      $(this).attr('src', imgSrc);
    });
  } else {
    $('.item img').each(lazyLoad);
  }

  // 分类页select框
  $('#inlineFormCustomSelect').on('change', function() {
    var value = $('#inlineFormCustomSelect option:checked').val();
    var listName = $('#inlineFormCustomSelect option:checked').text();
    $.get('/ajax_list', { cid: value }, function(datas) {
      if (datas.status === 200 && datas.message.length > 0) {
        var documentFragment = document.createDocumentFragment();
        datas.message.forEach(function(data) {
          var div = $('<div class="item mb-5"></div>')[0];
          div.innerHTML = '<div class="media">\n        <img\n          src="https://via.placeholder.com/110x110.png?text=shixtao.cn"\n          class="mr-3 img-fluid post-thumb d-none d-md-flex"\n          data-src="'.concat(data.img, '"\n        />\n        <div class="media-body">\n          <h2 class="title mb-1">\n            <a href="/article/').concat(data.id, '">').concat(data.title, '</a>\n          </h2>\n          <div class="meta mb-1">\n            <i class="iconfont icon-bokeyuan"></i>\n            <span title="\u535A\u5BA2\u7C7B\u578B"\n              >')
            .concat(data.type, '&nbsp;\n              <span class="text-info">\n                ')
            .concat(listName, '\n              </span>\n            </span>\n            <i class="iconfont icon-shizhong"></i>\n            <span title="\u53D1\u8868\u65F6\u95F4">')
            .concat(data.time, '</span>\n            <i class="iconfont icon-renyuan"></i>\n            <span title="\u535A\u5BA2\u4F5C\u8005">')
            .concat(data.author, '</span>\n            <i class="iconfont icon-pinglun"></i>\n            <span title="\u8BC4\u8BBA"\n              ><a href="/article/')
            .concat(data.id, '#form"\n                >')
            .concat(data.comment, ' \u8BC4\u8BBA</a\n              ></span\n            >\n            <i class="iconfont icon-liulan"></i>\n            <span title="\u6D4F\u89C8\u91CF">')
            .concat(data.click, '</span>\n          </div>\n          <div class="intro">')
            .concat(data.description, '</div>\n          <a class="more-link" href="/article/')
            .concat(data.id, '"\n            >\u66F4\u591A\u5185\u5BB9 &rarr;</a\n          >\n        </div>\n      </div>\n          ');
          documentFragment.appendChild(div);
        });
        $('.blog-list > .container').html(documentFragment);
        $('.item img').each(lazyLoad);
      } else {
        location.href = '/list';
      }
    });
  });
});

