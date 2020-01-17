const express = require('express'),
      router = express.Router(),
      query = require('../../config/db'),
      moment = require('moment'),
      pagess = require('../../common/page'),
      fs = require('fs'),
      multer = require('multer'),
      upload = multer({dest:'tmp/'}),
      uploads = require('../../common/uploads')
const log = console.log.bind(console)
//博客管理首页
router.get('/',(req,res,next) => {
    let size = 6
    let page = req.query.page ? req.query.page : 1
    async function countBlogs(){
        return await query(`SELECT COUNT(*) AS total FROM blogs,blogstype WHERE blogs.cid = blogstype.id`)
    }
    (async () => {
        try {
            let rows = await countBlogs()
            let total = rows[0].total
            let fpage = pagess(total,page,size)
            async function queryBlogs(){
                return await query(`SELECT blogs.*,blogstype.name tname FROM blogs,blogstype WHERE blogs.cid = blogstype.id ORDER BY blogs.id DESC LIMIT ${fpage.start},${fpage.size}`)
            }
            (async () => {
                try {
                    let rows2 = await queryBlogs()
                    rows2.forEach(element => {
                        element.time = moment(element.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
                    })
                    res.render('admin/blogs/index.html',
                    {
                        rows:rows2,show:fpage.show
                    })
                } catch (error) {
                    log(err)
                }
            })()
        } catch (error) {
            log(error)
        }
    })()
})
//博客管理添加页
router.get('/add',(req,res,next) => {
    (async () => {
        try {
            let queryType = await query(`SELECT * FROM blogstype ORDER BY id DESC`)
            res.render('admin/blogs/add.html',{rows:queryType})
        } catch (error) {
            log(error)
        }
    })()
})
//博客管理添加页处理
router.post('/add',upload.single('img'),(req,res,next) => {
    let imgRes = req.file
    let {type,title,keywords,description,author,cid,content} = req.body
    let click = 0
    let time = Math.round((new Date().getTime())/1000)
    let img = uploads(imgRes,'blogs');
    (async () => {
        try {
            let insertBlog = await query(`
            INSERT INTO blogs (type,title,keywords,description,author,cid,content,click,time,img,comment) VALUES 
            ('${type}','${title}','${keywords}','${description}','${author}',${cid},'${content}',${click},${time},'${img}',0)
            `)
            if(insertBlog.affectedRows === 1) {
                res.send("<script>alert('修改成功!');window.location.href='/admin/blogs'</script>")
            }else{
                res.send("<script>alert('修改失败');history.go(-1);</script>")
            }
        } catch (error) {
          log(error)  
        }
    })()
})
//博客修改页
router.get('/edit',(req,res,next) => {
    let id = req.query.id
    async function queryBlogstype(){
        return await query('SELECT * FROM blogstype')
    }
    async function editBlogs(){
        return await query(`SELECT * FROM blogs WHERE id = ${id}`)
    }
    (async () => {
        try {
           let BlogstypePromise = queryBlogstype()
           let BlogsPromise = editBlogs()
           let Blogstype = await BlogstypePromise
           let Blogs = await BlogsPromise
           res.render('admin/blogs/edit.html',{
            rows1:Blogstype,
            rows:Blogs[0]
           })
        } catch (error) {
            log(error)
        }
    })()
})
//博客修改页处理
router.post('/edit',upload.single('img'),(req,res,next) => {
    let imgRes = req.file
	let {id,type,title,keywords,description,oldimg,author,cid,content} = req.body
	let img = oldimg
	if(imgRes) {
	    img = uploads(imgRes,'blogs')
    }
    (async () => {
        try {
            let editBlogs = await query('UPDATE blogs SET type = ?,title = ?,img = ?,description = ?,keywords = ?,author = ?,content = ?,cid = ? WHERE id = ?',[type,title,img,description,keywords,author,content,cid,id])
            if(editBlogs.affectedRows === 1) {
				if(imgRes) {
					if(fs.existsSync(__dirname + "/../../"+oldimg)){
						fs.unlinkSync(__dirname + "/../../"+oldimg)
					}
				}
				res.send("<script>alert('修改成功！');window.location.href='/admin/blogs';</script>")
			}else{
				res.send("<script>alert('修改失败！');history.go(-1);</script>")
			}
        } catch (error) {
            log(error)
        }
    })()
})
//删除博客
router.get('/ajax_del',(req,res,next) => {
    let {id,img} = req.query;
    (async () => {
        try {
            let rows = await query(`DELETE FROM blogs WHERE id = ${id}`)
            if(rows.affectedRows === 1 ) {
                if(fs.existsSync(__dirname + "/../../"+img)){
                    fs.unlinkSync(__dirname + "/../../"+img)
                }
				res.send('1')
            }else{
                res.send('0')
            }
        } catch (err) {
            console.log(err)
        }
    })()
})

module.exports = router