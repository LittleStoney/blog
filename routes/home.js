const express = require('express'),
      router =  express.Router()
router.get('/',(req,res,next) => {
    res.render('home/index.html')
})





module.exports = router