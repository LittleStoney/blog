const express = require('express'),
      router =  express.Router(),
      query = require('../config/db'),
      log = console.log.bind(console)
router.get('/',(req,res,next) => {
    async function queryBlogs(){
        return await query('SELECT * FROM blogs')
    }
    async function queryComments(){
        return await query('SELECT * FROM comment')
    }
    (async () => {
        try {
            let [blogs,comments] = await Promise.all([
                queryBlogs(),
                queryComments()
            ])
        } catch (error) {
            console.log(error)
        }
        res.render('home/index.html')
    })()
})





module.exports = router