const express = require('express'),
      app = express(),
      ejs = require('ejs'),
      bodyParser = require('body-parser')
app.set('views','./views')
app.set('view engine','ejs')
app.engine('html',ejs.__express)
app.use('/public',express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded(
    {extended:false}
))
const indexRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
app.use('/',indexRouter)
app.use('/admin',adminRouter)
//开启服务
app.listen(8080,() => {
    console.log('http running at http://localhost:8080')
})