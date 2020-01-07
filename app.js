const express = require('express'),
    app = express(),
    ejs = require('ejs')

app.set('views','./views')
app.set('view engine','ejs')
app.engine('html',ejs.__express)
app.use('/public',express.static(__dirname+'/public'))
app.get('/',(req,res,next) => {
    res.render('home/index.html')
})
app.listen(8080,() => {
    console.log('http running at http://localhost:8080')
})