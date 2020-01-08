const express = require('express'),
      app = express(),
      ejs = require('ejs')

app.set('views','./views')
app.set('view engine','ejs')
app.engine('html',ejs.__express)
app.use('/public',express.static(__dirname+'/public'))
const indexRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
app.use('/',indexRouter)
app.use('/admin',adminRouter)
//开启服务
app.listen(8080,() => {
    console.log('http running at http://localhost:8080')
})