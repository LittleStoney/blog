"use strict";
// 去除空格
var inputs = document.querySelectorAll('input[type=text]')
inputs.forEach(function(item) {
    item.onkeyup = function(){
        this.value = this.value.trim()
    }
    item = null
})
var htmlHref = window.location.href
htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "")
var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1)
var index = addr.lastIndexOf("\/")
var id = decodeURI(addr.substring(index + 1, addr.length))
//保存用户名
var username = localStorage.getItem('username')
if(username) {
	$('#name').val(username)
}else{
	$('#name').val('')
}
//提交评论
$(function(){
    $('#form').on('submit',function(){
        var comment = $('#form-control').val()
        var name = $('input[name=name]').val()
        comment = filterXSS(comment)
        name = filterXSS(name)
        var time = new Date().toLocaleString()
        var face = $('select[name=face]').val()
        if(!comment.replace(/ +/g,"").replace(/[\r\n]/g,"")){
            alert('请输入内容！')
            return false
        }
        $.ajax({
            type:'POST',
            url:'/blogs/' + id,
            data:{
              name:name,
              comment:comment,
              time:time,
              face:face
            },
			success:function(data){
                if(data === 'ok'){
                localStorage.setItem('username',name)
                $('.table tbody').prepend("<tr><td><div class=\"touxiang\"><img src=\"".concat(face, "\" alt=\"\u4EBA\u7269\u5934\u50CF\" width=\"50\" height=\"50\"><div>").concat(name, "</div></div><div class=\"content\">").concat(comment, "<br><small>").concat(time, "</small></div></td></tr>"))
                $('#form-control').val('')
                $('input[name=name]').val('')
                }else{
                    alert('非法错误！')
                    return false
                }  
            },
            error:function(error){
                alert('非法错误！'+error.toString())
                return false
            }
        })
        return false
    })
})
//显示回复框
function reply(user_id){
    $('.table form').css('display','none')
    $('#' + user_id).show()
//提交回复
    $('#' + user_id).on('submit',function(){
        var replycomment = $('#' + user_id + 'reply').val()
        var replyname = $('#' + user_id + 'name').val()
        var replytime = new Date().toLocaleString()
        var replyface = $('#' + user_id + 'replyface').val()
        replycomment = filterXSS(replycomment)
        replyname = filterXSS(replyname)
        if(!replycomment.replace(/ +/g,"").replace(/[\r\n]/g,"")){
            alert('请输入内容！')
            return false
        }
        $.ajax({
            type:'POST',
            url:'/reply?id=' + user_id + '&blog_id=' + id,
            data:{
                replyname:replyname,
                replycomment:replycomment,
                replytime:replytime,
                replyface:replyface
            },
            success:function(data){
                var toname = $('#' + user_id + 'toname').html()
                if(data === 'ok') {
                    $('#' + user_id).parent().prepend(`
                    <div class="reply_area">
                        <span class="reply_info">
                            <img src="${replyface}" alt="人物头像" width="50" height="50">
                            <span>${replyname}<span class="text-info">&nbsp;回复&nbsp;</span><span id=""></span>:</span>
                        </span>
                        <span class="reply_content">
                            ${replycomment}<br>
                            <small>${replytime}</small>   
                        </span>
                        </div>
                    `)
                    $('#' + user_id + 'reply').val('')
                    $('#' + user_id + 'name').val('')
                }
            },
            error:function(error){
                alert('非法错误！'+error.toString())
                return false
            }
        })
        return false
    })
}

