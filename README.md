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

​	为优化前端性能，加快页面打开速度，本博客前台静态资源采用了如下优化：

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


#### 已知bug
+   ~~后台session过期会在浮动框架中显示登陆页面~~
+   @1000 评论添加、删除时需要同步更新评论数；管理后台审核评论也需要更新
+   ~~@1100 搜索页关键词高亮存在问题，关键词分类页也会高亮~~
+   ~~@2000 评论区存在严重bug，正在紧急修复中~~
+   ~~@1200 后台需要校验不上传博客封面的情况~~



#### 需求

+ ~~feat: #1000 使用egg+sequelize重构数据库~~（考虑sequelize复杂性放弃）
+ feat: #1100 评论区接入QQ登录，使用QQ用户的头像和姓名
+ ~~feat: #1200 搜索框关键词高亮~~
+ ~~feat: #2000 完善评论回复功能~~
+ ~~feat: #1300 主页分页ui美化~~
+ ~~feat: #3000 静态资源js/css采用gulp打包优化缓存~~
+ ~~feat: #1400 读取博客配置逻辑改为读取egg config文件~~(config只读，不推荐更改)



