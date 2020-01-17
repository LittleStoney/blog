const express = require('express'),
      app = express(),
      ejs = require('ejs'),
      bodyParser = require('body-parser'),
      ueditor = require('ueditor')
      path = require('path'),
      session = require('express-session')
app.set('views','./views')
app.set('view engine','ejs')
app.engine('html',ejs.__express)
app.use('/public',express.static(__dirname+'/public'))
app.use('/upload',express.static(__dirname+'/upload'))
app.use('/images',express.static(__dirname+'/images'))
app.use(bodyParser.urlencoded(
    {extended:false}
))
app.use(session({
    secret: 'shixtao',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*24*30},
  }))
app.use('/public/ueditor/ueditors', ueditor(path.join(__dirname, ''), (req, res, next) => {
    if (req.query.action === 'uploadimage') {
        let foo = req.ueditor
        let imgname = req.ueditor.filename
        let img_url = '/images/ueditor/'
        res.ue_up(img_url)
        res.setHeader('Content-Type', 'text/html')
    }
    else if (req.query.action === 'listimage') {
        let dir_url = '/images/ueditor/'
        res.ue_list(dir_url)
    }
    else {
        res.setHeader('Content-Type', 'application/json')
        res.redirect('/public/ueditor/php/config.json')
    }
}))
const indexRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
app.use('/',indexRouter)
app.use('/admin',adminRouter)
app.use((req,res,next) => {
    res.send('404 NOT found')
  })
//开启服务
app.listen(3000,() => {
    console.log('http running at http://localhost:3000')
})