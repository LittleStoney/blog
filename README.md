# blog

### 介绍
个人博客源码，基于原express框架完全重构，新版由Egg.js框架搭建（BootStrap + jQuery + ejs），喜欢请star，谢谢！

https://shixtao.cn

#### 	安装教程

1. 如果你有Node.js基础，那么很简单，首先进入文件目录终端执行命令安装依赖

   ```bash
   yarn
   #or
   npm install
   ```

   

2. **添加数据库，mysql执行blog_egg.sql文件**（必须）。注意数据库的名称、账户和密码，在config目录下的config.default.js可以修改相关参数

3.  本地开发

   ```bash
   yarn dev
   #or
   npm run dev
   ```


4. 线上部署

   ```bash
   yarn start
   #or
   npm start
   # https
   yarn start -- --port=443
   ```

   

#### 使用说明

  后台管理初始账号：123456  初始密码：12345678
  开启https服务：请查看个人博客说明：https://shixtao.cn/article/41

  免费申请SSL证书：https://letsencrypt.osfipin.com/  



#### 静态资源

​	为优化前端性能，加快页面打开速度，本博客前台静态资源采用了如下优化：（https://shixtao.cn/article/54）

  + BootStrap 和 jQuery 采用了BootCDN加速 https://www.bootcdn.cn/

  + public静态资源采用egg-static设置强缓存，时长为1周

  + 前台**index.css**和**style.js、form.js**文件采用gulp打包压缩合并，且设置contentHash文件名，每次更改内容打包后文件名会发生变化，使客户端能及时获取最新文件内容，防止继续读取缓存

    + 打包静态css+js方法

      ```bash
      yarn build
      #or
      npm run build
      ```

      打包后新生成的文件在 _/public/home/dist/_ 目录下



#### 参与贡献

    *Copyright © 2019 Shixtao@qq.com*



