# blog_egg

#### 介绍
个人博客源码，基于原express框架（dev分支，不再维护）完全重构，新版由Egg.js框架搭建，喜欢请star，谢谢！

https://shixtao.cn

#### 安装教程

1. 如果你有Node.js基础，那么很简单，首先进入文件目录终端执行命令安装依赖

   ```powershell
   yarn
   #or
   npm install
   ```

   

2. **添加数据库，mysql执行blog_egg.sql文件**（必须）。注意数据库的名称、账户和密码，在config目录下的config.default.js可以修改相关参数

3.  本地开发

   ```powershell
   yarn dev
   #or
   npm dev
   ```


4. 线上部署

   ```powershell
   yarn start
   #or
   npm start
   ```

   

#### 使用说明

  后台管理初始账号：123456  初始密码：12345678
  开启https服务：请查看个人博客说明：https://shixtao.cn/article/41

  免费申请SSL证书：https://letsencrypt.osfipin.com/

#### 参与贡献

    *Copyright © 2019 Shixtao*

## 已知bug
+   后台session过期会在浮动框架中显示登陆页面 




