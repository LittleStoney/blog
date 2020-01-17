//分页函数
function pagess(total,page=1,size=4) {
    //1.计算截取的开始位置、结束位置、总页数
    let start = (page -1 ) * size
    let pages = Math.ceil(total/size)
    //2.展示分页效果
    let show = ""
    show+=`<a href="?page=1" class="page-link">首页</a>`
    show+=`<a href="?page=${ page-1 >=1 ? page-1 : 1}" class="page-link">上一页</a>`
    show+=`<span class="current">${page}</span>`
    show+=`<a href="?page=${ Number(page)+1 <= pages ? Number(page)+1 : page}" class="page-link">下一页</a>`
    show+=`<a href="?page=${pages}" class="page-link">尾页</a>`
    return {
      start:start,
      size:size,
      show:show
    }
  }
  module.exports = pagess