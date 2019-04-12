---
title: Hexo添加文章时自动打开编辑器
comments: true
categories: Hexo
tags: Hexo
abbrlink: e7fa2d4f
date: 2018-12-09 17:46:34
---

### 前言
在`Hexo`中新建一篇博文非常简单，只需要在命令行中键入以下命令然后回车即可：
```
  hexo new "The title of your blog"
```
此后`Hexo`便会在`Hexo`的根目录的`source`文件夹下的`_posts`目录下自动帮你创建相应的md文件。然后我们打开该目录，找到刚刚`Hexo`自动生成的文件打开编辑即可。

但是当我们的博文比较多，这样我们就需要在成堆的`Markdown`文件中找到刚才自动生成的文件，这样做显然是一件比较痛苦的事情。下面介绍一种添加文章时自动打开编辑器的方法。

### 原理
利用`NodeJS`的事件监听机制实现监听`Hexo`的`new`事件来启动编辑器，完成自动启动编辑器的操作。  

### 解决办法
- 首先在`Hexo`目录下的`scripts`目录中创建一个 JavaScript 脚本文件。
- 如果没有这个`scripts`目录，则新建一个。
- `scripts`目录新建的 JavaScript 脚本文件可以任意取名。

通过这个脚本，我们用其来监听`hexo new`这个动作，并在检测到`hexo new`之后，执行编辑器打开的命令。

如果你是`Windows`平台的`Hexo`用户，则将下列内容写入你的脚本：
```
  var spawn = require('child_process').exec;

  // Hexo 2.x 用户复制这段
  hexo.on('new', function(path){
    spawn('start  "markdown编辑器绝对路径.exe" ' + path);
  });

  // Hexo 3 用户复制这段
  hexo.on('new', function(data){
    spawn('start  "markdown编辑器绝对路径.exe" ' + data.path);
  });
```
如果你是`Mac`平台`Hexo`用户，则将下列内容写入你的脚本：
```
  var exec = require('child_process').exec;

  // Hexo 2.x 用户复制这段
  hexo.on('new', function(path){
      exec('open -a "markdown编辑器绝对路径.app" ' + path);
  });
  // Hexo 3 用户复制这段
  hexo.on('new', function(data){
      exec('open -a "markdown编辑器绝对路径.app" ' + data.path);
  });
```
保存并退出脚本之后，在命令行中键入：
```
  hexo new "auto open editor test"
```
就可以顺利的自动打开自动生成的md文件啦~
