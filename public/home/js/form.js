"use strict";
// 去除空格
var input = document.querySelector('input[type=text]')
input.onkeyup = function(){
	this.value = this.value.trim()
}
var htmlHref = window.location.href
htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "")
var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1)
var index = addr.lastIndexOf("\/")
var id = decodeURI(addr.substring(index + 1, addr.length))
//提交评论
$(function(){
    $('#form').on('submit',function(){
        var comment = $('#form-control').val()
        var name = $('#name').val()
        var time = new Date().toLocaleString()
        var face = $('select[name=face]').val()
        console.log(face)
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
                $('.table tbody').prepend(`
                <tr>
                    <td>
                    <div class="touxiang">
                        <img src="${face}" alt="人物头像" width="50" height="50">
                        <div>${name}</div>
                    </div>             
                    <div class="content">
                        ${comment}
                        <br>
                        <small>${time}</small>   
                    </div>
                    </td>
                </tr>
                `)
                $('#form-control').val('')
                $('#name').val('')
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
