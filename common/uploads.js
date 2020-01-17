const fs = require('fs'),
      path = require('path')

function uploads(imgRes,type=''){
    let tmpPath = imgRes.path
	// 文件上传的执行目录
	let ext = path.extname(imgRes.originalname)
	let newName = ''+(new Date().getTime())+Math.round(Math.random()*10000)+ext
	let newPath = '/upload/'+newName
	// 进行文件拷贝
	fs.readFile(tmpPath,(err,data) => {
		if(err) throw new Error(err)
		fs.writeFile(__dirname+'/../'+newPath,data,err => {
			if(err) throw new Error(err)
		})
	})
    return newPath
}

module.exports = uploads