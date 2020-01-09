const express = require('express'),
      router =  express.Router(),
      query = require('../config/db'),
      fs = require('fs'),
      moment = require('moment')

const log = console.log.bind(console)
const webConfigData = fs.readFileSync(__dirname + '/../config/webConfig.json')
const webConfig = JSON.parse(webConfigData.toString())
//首页
router.get('/',(req,res,next) => {
    async function queryBlogs(){
        return await query('SELECT * FROM blogs')
    }
    (async () => {
        try {
            let blogsPromise = queryBlogs()
            let blogs = await blogsPromise
            for (const item of blogs) {
                item.time = moment(item.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
            }
            res.render('home/index.html',{
                webConfig:webConfig,
                blogs:blogs
            })
        } catch (error) {
            log(error)
        }
    })()
})
//博客文章页
router.get('/article/:id',(req,res,next) => {
    let id = req.params.id
    async function queryBlog(){
        return await query(`SELECT * FROM blogs WHERE id = ${id} ORDER BY blogs.id DESC`)
    }
    (async () => {
        try {
            let blogsPromise = queryBlog()
            let blogs = await blogsPromise
            blogs.forEach(item => {
                item.time = moment(item.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
              })
            res.render('home/article.html',{
                webConfig:webConfig,
                blog:blogs[0]
            })
        } catch (error) {
            log(error)
        }
    })()
})







module.exports = router