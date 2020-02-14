# blogv2

#### 介绍
个人博客源码，后台由express搭建,前台模板引擎为ejs

#### 安装教程

1.  yarn or npm install 安装依赖
2.  **添加数据库，mysql执行sql文件**
3.  yarn start or npm start 启动

#### 使用说明

  后台管理初始账号：123456 初始密码：12345678
  开启https服务：引入redirectToHTTPS yarn add redirectToHTTPS  or npm i redirectToHTTPS   --save


```
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS， //引入重定向模块
      fs = require('fs'),
      http = require('http'),
      https = require('https')
const options = {
    key:fs.readFileSync(""),   //你的https证书目录
    cert:fs.readFileSync(""),  //同上
    requestCert: false,
    rejectUnauthorized: false
}
let httpserver = http.createServer(options,app)
httpserver.listen(80, () => {
    console.log('http server OK')
})
let httpsServer = https.createServer(options,app)
httpsServer.listen(443, () => {
    console.log('HTTPS Listening at https://localhost')
})
```



#### 参与贡献

    *Copyright © 2019 Shixtao*

## 已知bug
+   前台回复评论 to 某人时 会一定概率显示undefined
+   后台session过期会在浮动框架中显示登陆页面


