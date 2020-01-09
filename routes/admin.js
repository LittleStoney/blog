const express = require('express'),
      router = express.Router(),
      log = console.log.bind(console)
//后台首页
router.get('/',(req,res,next) => {
    res.render('admin/index.html')
})
//博客分类管理
//系统管理
let blogstypeRouter = require('./admin/blogstype')
router.use('/blogstype',blogstypeRouter)
//管理员管理
let adminRouter = require('./admin/admin')
router.use('/admin',adminRouter)
//系统管理
let systemRouter = require('./admin/system')
router.use('/system',systemRouter)

module.exports = router