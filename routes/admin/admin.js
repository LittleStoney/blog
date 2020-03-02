const express = require('express'),
    router = express.Router(),
    query = require('../../config/db'),
    moment = require('moment'),
    crypto = require('crypto')

const log = console.log.bind(console)
//管理员管理首页
router.get('/', (req, res, next) => {
    let search = req.query.search ? req.query.search : "";
    (async () => {
        try {
            let rows = await query('SELECT * FROM admin WHERE adminname LIKE ? ORDER BY id DESC', [`%${search}%`])
            rows.forEach(item => {
                item.time = moment(item.time * 1000).format("YYYY年MM月DD日 HH:mm:ss")
            })
            res.render('admin/admin/index.html', {
                search,
                rows
            })
        } catch (err) {
            log(err)
        }
    })()
})
//管理员添加页
router.get('/add', (req, res, next) => {
    res.render('admin/admin/add.html')
})
//管理员添加页处理
router.post('/add', (req, res, next) => {
    let { adminname, password, repassword } = req.body
    if (adminname) {
        if (adminname.length >= 6 && adminname.length <= 12) {
            if (password) {
                if (password === repassword) {
                    (async () => {
                        try {
                            let name = await query('SELECT * FROM admin WHERE adminname = ?', [adminname])
                            if (name.length === 0) {
                                let time = Math.trunc((new Date().getTime()) / 1000)
                                let md5 = crypto.createHash('md5')
                                password = md5.update(password).digest('hex')
                                let addAdmin = await query('INSERT INTO admin (adminname,password,status,time) VALUES (?,?,?,?)', [adminname, password, 0, time])
                                if (addAdmin.affectedRows === 1) {
                                    res.send("<script>alert('添加成功！');window.location.href = '/admin/admin'</script>")
                                } else {
                                    res.send("<script>alert('添加失败！');history.go(-1);</script>")
                                }
                            } else {
                                res.send("<script>alert('该用户名已注册，请重新输入！');history.go(-1);</script>")
                            }
                        } catch (error) {
                            log(error)
                        }
                    })()
                } else {
                    res.send("<script>alert('两次输入的密码不一致！');history.go(-1);</script>")
                }
            } else {
                res.send("<script>alert('请输入密码!');history.go(-1);</script>")
            }
        } else {
            res.send("<script>alert('管理员名长度在6到12位之间!');history.go(-1);</script>")
        }
    } else {
        res.send("<script>alert('请输入管理员名!');history.go(-1);</script>")
    }

})
//ajax修改黑白名单
router.get('/ajax_status', (req, res, next) => {
    let { id, status } = req.query;
    (async () => {
        try {
            let Admin = await query(`
            UPDATE admin SET status = ${status} WHERE id = ${id}
            `)
            if (Admin.affectedRows === 1) {
                res.send('1')
            } else {
                res.send('0')
            }
        } catch (error) {
            log(error)
        }
    })()
})
//ajax删除管理员
router.get('/ajax_del', (req, res, next) => {
    let id = req.query.id;
    (async () => {
        try {
            let delAdmin = await query(`
            DELETE FROM admin WHERE id = ${id}
            `)
            if (delAdmin.affectedRows == 1) {
                res.send('1')
            } else {
                res.send('0')
            }
        } catch (error) {
            log(error)
        }
    })()
})
//管理员修改页
router.get('/edit', (req, res, next) => {
    let id = req.query.id;
    (async () => {
        try {
            let queryAdmin = await query(`
            SELECT * FROM  admin WHERE id = ${id}
            `.trim())
            res.render('admin/admin/edit.html', { queryAdmin: queryAdmin[0] })
        } catch (error) {
            log(error)
        }
    })()
})
//管理员修改页处理
router.post('/edit', (req, res, next) => {
    let { id, adminname, password, repassword, status } = req.body
    let sql = ""
    if (password) {
        if (password === repassword) {
            let md5 = crypto.createHash('md5')
            password = md5.update(password).digest('hex')
            sql = `UPDATE admin SET status = ${status},password = '${password}' WHERE id = ${id}`
        } else {
            res.send("<script>alert('两次输入的密码不一致！');history.go(-1)</script>")
        }
    } else {
        sql = `UPDATE admin SET status = ${status} WHERE id = ${id}`
    }
    (async () => {
        try {
            let rows = await query(sql)
            if (rows.affectedRows == 1) {
                res.send("<script>alert('修改成功!');window.location.href = '/admin/admin'</script>")
            } else {
                res.send("<script>alert('修改失败');history.go(-1);</script>")
            }
        } catch (error) {
            log(err)
        }
    })()
})

module.exports = router