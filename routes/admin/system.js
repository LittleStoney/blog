const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    multer = require('multer'),
    upload = multer({ dest: 'tmp/' }),
    uploads = require('../../common/uploads')

const log = console.log.bind(console)
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}
//系统管理首页
router.get('/', (req, res, next) => {
    let fileData = readFile(__dirname + "/../../config/webConfig.json")
        .then(e => {
            let data = JSON.parse(e.toString())
            res.render('admin/system/index.html', { data: data })
        })
        .catch(error => { log(error); return })
})
//系统管理首页处理
router.post('/save', upload.single('logo'), (req, res, next) => {
    let imgRes = req.file
    let { title, keywords, description, copyright, record, logo } = req.body
    let newlogo = ''
    if (imgRes) {
        newlogo = uploads(imgRes)
    }
    let data = {
        title,
        keywords,
        description,
        copyright,
        record,
        logo: newlogo ? newlogo : logo
    }
    fs.writeFile(__dirname + '/../../config/webConfig.json', JSON.stringify(data), err => {
        if (err) throw new Error(err)
        return
    })
    if (imgRes) {
        fs.unlinkSync(__dirname + '/../../' + logo)
    }
    res.send("<script>alert('修改成功');window.location.href='/admin/system'</script>")
})

module.exports = router