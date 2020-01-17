const express = require('express'),
      router = express.Router(),
      query = require('../../config/db')

const log = console.log.bind(console)
//博客分类首页
router.get('/',(req,res,next) => {
    (async () => {
        try {
            let queryTypes = await query('SELECT * FROM blogstype')
            res.render('admin/blogstype/index.html',{
                rows:queryTypes
            })
        } catch (error) {
            log(error)
        }
    })()
})
//博客分类添加页
router.get('/add',(req,res,next) => {
    res.render('admin/blogstype/add.html')
})
//博客分类页处理
router.post('/add',(req,res,next) => {
    let {name,sort} = req.body;
    (async () => {
        try {
            let addType = await query(`
            INSERT INTO blogstype (name,sort) VALUES ('${name}','${sort}')
            `)
            if(addType.affectedRows === 1 ){
                res.send("<script>alert('添加成功！');window.location.href='/admin/blogstype'</script>")
            }else{
                res.send("<script>alert('添加失败！');history.go(-1)</script>")
            }
        } catch (error) {
            log(error)
        }
    })()
})
//博客修改页
router.get('/edit',(req,res,next) => {
    let id = req.query.id;
    (async () => {
        try {
            let queryBlog = await query(`SELECT * FROM blogstype WHERE id = ${id}`)
            res.render('admin/blogstype/edit.html',{rows:queryBlog[0]})
        } catch (error) {
            log(error)
        }
    })()
})
//博客修改页处理
router.post('/edit',(req,res,next) => {
    let {id,name,sort} = req.body;
    (async () => {
        try {
            let editBlog = await query(`
            UPDATE blogstype SET name = '${name}',sort = ${sort} WHERE id = ${id}
            `)
            if(editBlog.affectedRows === 1) {
                res.send("<script>alert('修改成功!');window.location.href = '/admin/blogstype'</script>")
            }else{
                res.send("<script>alert('修改失败!');history.go(-1);</script>")
            }
        } catch (error) {
            log(error)
        }
    })()
})
//博客分类删除
router.get('/ajax_del',(req,res,next) => {
    let id = req.query.id;
    (async () => {
        try {
            let delBlog = await query(`
            DELETE FROM blogstype WHERE id = ${id}
            `)
            if(delBlog.affectedRows === 1) {
                res.send('1')
            }else{
                res.send('0')
            }
        } catch (error) {
            log(error)
        }
    })()
})

module.exports = router