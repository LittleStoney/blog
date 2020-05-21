"use strict";
// 去除空格
var inputs = document.querySelectorAll('input[type=text]')
inputs.forEach(function (item) {
    item.onkeyup = function () {
        this.value = this.value.trim()
    }
})
// 处理url信息
var htmlHref = window.location.href
htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "")
var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1)
var index = addr.lastIndexOf("\/")
var id = decodeURI(addr.substring(index + 1, addr.length))
//保存用户名至localStorage
var username = localStorage.getItem('username')
if (username) {
    $('#name').val(username)
} else {
    $('#name').val('')
}
//提交评论
$(function () {
    $('#form').on('submit', function (e) {
        var name = $('input[name=name]').val().replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**'),
            comment = $('#form-control').val().replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**')
        var time = new Date().toLocaleString()
        var face = $('select[name=face]').val()
        if (!comment.replace(/ +/g, "").replace(/[\r\n]/g, "")) {
            alert('请输入内容！')
            return false
        }
        $.ajax({
            type: 'POST',
            url: '/blogs/' + id,
            data: {
                name: name,
                comment: comment,
                time: time,
                face: face
            },
            success: function (data) {
                if (data.meta.status === 200) {
                    localStorage.setItem('username', name)
                    var content = "<tr><td><div class=\"touxiang\"><img src=\"".concat(face, "\" alt=\"\u4EBA\u7269\u5934\u50CF\" width=\"50\" height=\"50\"><div>").concat(name, "</div></div><div class=\"content\">").concat(comment, "<br><small>").concat(time, "</small></div></td></tr>")
                    $('.table tbody').prepend(content)
                    $('#form-control').val('')
                    $('input[name=name]').val('')
                } else {
                    alert('非法错误！')
                    return false
                }
            },
            error: function (error) {
                alert('非法错误！' + error.toString())
                return false
            }
        })
        e.preventDefault()
        return false
    })
})
//显示回复框
function reply(user_id) {
    $('.table form').css('display', 'none')
    $('#' + user_id).show()
    //提交回复
    $('#' + user_id).on('submit', function () {
        var replycomment = $('#' + user_id + 'reply').val().replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**'),
            replyname = $('#' + user_id + 'name').val().replace(/做爱|黄色|日|妈|操|gay|fuck/gi, '**')
        var replytime = new Date().toLocaleString()
        var replyface = $('#' + user_id + 'replyface').val()
        var toname = $('#' + user_id + 'toname').html()
        if (!replycomment.replace(/ +/g, "").replace(/[\r\n]/g, "")) {
            alert('请输入内容！')
            return false
        }
        $.ajax({
            type: 'POST',
            url: '/reply?id=' + user_id + '&blog_id=' + id,
            data: {
                replyname: replyname,
                replycomment: replycomment,
                replytime: replytime,
                replyface: replyface
            },
            success: function (data) {
                if (data.meta.status === 200) {
                    $('#' + user_id).parent().prepend("<div class=\"reply_area\"><span class=\"reply_info\"><img src=\"".concat(replyface, "\" alt=\"\u4EBA\u7269\u5934\u50CF\" width=\"50\" height=\"50\"> <span>").concat(replyname, "<span class=\"text-info\">&nbsp;\u56DE\u590D&nbsp;</span><span id=\"\"></span>").concat(toname, ":</span></span><span class=\"reply_content\">").concat(replycomment, "<br><small>").concat(replytime, "</small></span></div>"))
                    $('#' + user_id + 'reply').val('')
                    $('#' + user_id + 'name').val('')
                    $('#' + user_id).hide()
                } else {
                    alert('非法错误！')
                    return false
                }
            },
            error: function (error) {
                alert('非法错误！' + error.toString())
                return false
            }
        })
        return false
    })
}

