const express = require('express'),
    router = express.Router(),
    query = require('../config/db'),
    fs = require('fs'),
    moment = require('moment')

const log = console.log.bind(console)
const webConfigData = fs.readFileSync(__dirname + '/../config/webConfig.json')
const webConfig = JSON.parse(webConfigData.toString())
//首页
router.get('/', (req, res, next) => {
    let page = req.query.page || 1
    let start = (page - 1) * 6
    let end = 6
    let search = req.query.search || '';
    (async () => {
        try {
            let blogs = await query('SELECT * FROM blogs WHERE title LIKE ? ORDER BY id DESC LIMIT ?, ?', [`%${search}%`, start, end])
            let num = await query(`
            SELECT COUNT(*) AS num FROM blogs
            `)
            let lists = await query(`
            SELECT * FROM blogstype
            `)
            num = num[0].num  //得到总页数
            let pageNum = Math.ceil(num / 6)
            for (const item of blogs) {
                item.time = moment(item.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
            }
            res.render('home/index.html', {
                webConfig: webConfig,
                blogs: blogs,
                pageNum: pageNum,
                page: page,
                lists: lists,
                search: search
            })
        } catch (error) {
            log(error)
        }
    })()
})
//博客文章页
router.get('/article/:id', (req, res, next) => {
    let id = req.params.id
    async function queryBlog() {
        return await query(`SELECT * FROM blogs WHERE id = ${id} ORDER BY blogs.id DESC`)
    }
    async function queryList() {
        return await query(`
        SELECT blogstype.name,blogs.id FROM blogs,blogstype WHERE blogs.cid = blogstype.id AND blogs.id = ${id}
        `)
    }
    async function queryComments() {
        return await query(`
        SELECT * FROM comment WHERE blog_id = ${id} AND status = 1 ORDER BY id DESC
        `)
    }
    async function queryReply() {
        return await query(`
        SELECT * FROM reply WHERE blog_id = ${id} AND status = 1
        `)
    }
    (async () => {
        try {
            let blogsPromise = queryBlog()
            let blogs = await blogsPromise
            let listPromise = queryList()
            let list = await listPromise
            let commentsPromise = queryComments()
            let comments = await commentsPromise
            let replyPromise = queryReply()
            let reply = await replyPromise
            let updateClick = await query(`
            UPDATE blogs SET click = click + 1 WHERE id = ${id}
            `)
            blogs.forEach(item => {
                item.time = moment(item.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
            })
            res.render('home/article.html', {
                webConfig: webConfig,
                blog: blogs[0],
                list: list[0],
                comments: comments,
                replys: reply
            })
        } catch (error) {
            log(error)
        }
    })()
})
//处理评论
router.post('/blogs/:id', (req, res, next) => {
    let { name, comment, time, face } = req.body
    let id = req.params.id;
    (async () => {
        try {
            let rows = await query('INSERT INTO comment (blog_id,name,content,face,time,status) VALUES (?,?,?,?,?,?)', [id, name, comment, face, time, 1])
            if (rows.affectedRows === 1) {
                let updateComment = await query(`UPDATE blogs SET comment = comment + 1 WHERE id = ${id}`)
                res.send('ok')
            } else {
                res.send('fail')
            }
        } catch (error) {
            log(error)
        }
    })()
})
//处理回复
router.post('/reply', (req, res, next) => {
    let user_id = req.query.id
    let blog_id = req.query.blog_id
    let { replyname, replycomment, replytime, replyface } = req.body;
    (async () => {
        try {
            let rows = await query('INSERT INTO reply (name,content,time,status,reply_id,blog_id,face) VALUES (?,?,?,?,?,?,?)', [replyname, replycomment, replytime, 1, user_id, blog_id, replyface])
            let updateComment = await query(`UPDATE blogs SET comment = comment + 1 WHERE id = ${blog_id}`)
            if (rows.affectedRows === 1) {
                res.send('ok')
            } else {
                res.send('fail')
            }
        } catch (error) {
            log(error)
        }
    })()

})

module.exports = router