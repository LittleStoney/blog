const express = require('express'),
      router = express.Router()
router.get('/',(req,res,next) => {
    res.render('admin/index.html')
})

//系统管理
let systemRouter = require('./admin/system')
router.use('/system',systemRouter)
module.exports = router