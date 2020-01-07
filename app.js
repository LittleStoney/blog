const app = require('express')()
app.get('/',(req,res,next) => {
    res.send('hello')
})
app.listen(8080,() => {
    console.log('http running at http://localhost:8080')
})