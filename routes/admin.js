const express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    query = require('../config/db')

const log = console.log.bind(console)
//监听用户访问
router.use((req, res, next) => {
    if (req.url != '/login' && req.url != '/check') {
        if (req.session.YzmMessageIsAdmin && req.session.YzmMessagePass) {
            next()
        } else {
            res.send("<script>window.location.href='/admin/login'</script>")
        }
    } else {
        next()
    }
})
//登录页
router.get('/login', (req, res, next) => {
    if (req.session.YzmMessageIsAdmin && req.session.YzmMessagePass) {
        res.redirect('/admin')
    } else {
        res.render('admin/login.html')
    }
})
//退出登录
router.get('/logout', (req, res, next) => {
    req.session.YzmMessageIsAdmin = false
    req.session.YzmMessageUsername = false
    res.send("<script>alert('退出成功！');window.location.href='/admin/login'</script>")
})
//登录页处理
router.post('/check', (req, res, next) => {
    let { adminname, password } = req.body
    if (adminname) {
        if (password) {
            let md5 = crypto.createHash('md5')
            password = md5.update(password).digest('hex');
            (async () => {
                try {
                    let namerows = await query('SELECT * FROM admin WHERE adminname = ?  AND status = ?', [adminname, 0])
                    if (namerows.length) {
                        let passrows = await query('SELECT * FROM admin WHERE adminname = ? AND password = ?  AND status = ?', [adminname, password, 0])
                        if (passrows.length) {
                            req.session.YzmMessageIsAdmin = true
                            req.session.YzmMessagePass = true
                            res.send('ok')
                        } else {
                            res.send('Nopass')
                        }
                    } else {
                        res.send('Noname')
                    }
                } catch (error) {
                    log(error)
                    return
                }
            })()
        }
    }
})
//后台首页
router.get('/', (req, res, next) => {
    res.render('admin/index.html')
})
//欢迎页
router.get('/welcome', (req, res, next) => {
    res.render('admin/welcome.html')
})
//博客内容管理
let blogsRouter = require('./admin/blogs')
router.use('/blogs', blogsRouter)
//博客分类管理
let blogstypeRouter = require('./admin/blogstype')
router.use('/blogstype', blogstypeRouter)
//评论管理
let commentRouter = require('./admin/comment')
router.use('/comment', commentRouter)
//管理员管理
let adminRouter = require('./admin/admin')
router.use('/admin', adminRouter)
//系统管理
let systemRouter = require('./admin/system')
router.use('/system', systemRouter)

module.exports = router