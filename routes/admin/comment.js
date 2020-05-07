const express = require('express'),
    router = express.Router(),
    query = require('../../config/db')

const log = console.log.bind(console)
//查询评论
router.get('/', (req, res, next) => {
    (async () => {
        try {
            let comment = await query(`
            SELECT comment.*,blogs.title,blogs.img
            FROM comment,blogs WHERE comment.blog_id = blogs.id ORDER BY comment.id DESC
            `)
            res.render('admin/comment/index.html', {
                comment: comment
            })
        } catch (error) {
            log(error)
            return
        }
    })()
})
//修改评论状态
router.get('/ajax_status', (req, res, next) => {
    let { id, status } = req.query;
    (async () => {
        try {
            let rows = await query(`UPDATE comment SET status = ${status} WHERE id = ${id}`)
            if (rows.affectedRows == 1) {
                res.send('1')
            } else {
                res.send('0')
            }
        } catch (error) {
            log(error)
            return
        }
    })()
})

module.exports = router