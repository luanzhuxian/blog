---
title: Hexo + Next搭建博客
comments: true
categories: Hexo
tags: Hexo
abbrlink: 73f1724d
date: 2018-12-09 17:46:34
---


<blockquote bgcolor=#FF4500>
[Hexo](https://hexo.io/) 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页
</blockquote>

## 配置环境
### 申请GitHub
作用：用来做博客的远程创库、域名、服务器  
[Github](https://github.com/)注册账号。

### 安装Node.js
作用：用来生成静态页面的  
[官网下载](https://nodejs.org/)并安装。安装成功后可用 `node -v` 查看版本号。

### 安装Git
作用：把本地的 Hexo 内容提交到 Github 上去  
Mac 安装 Xcode 自带有 Git，WSindows 可去[官网下载](https://git-scm.com/)。  
安装完成后，还需要设置你 Github 的用户名密码，在命令行输入  
``` bash
  $ git config --global user.name "Your Name"
  $ git config --global user.email "email@example.com"
```

因为 Git 是分布式版本控制系统，所以，每个机器都必须自报家门：你的名字和 Email 地址。安装成功后可用 `git --version` 查看版本号。

## 安装并本地部署Hexo

执行如下命令安装 Hexo
``` bash
  $ npm install -g hexo-cli
```

创建一个文件夹，用来存放 Hexo 的配置文件，进入该文件夹
``` bash
  hexo init <folder>
  cd <folder>
  npm install
```

现在项目根目录结构如下
``` bash
  .
  ├── public // 执行 hexo generate 命令，输出的静态网页内容目录
  ├── scaffolds // 模板文件夹。当你新建文章时，Hexo会根据scaffold来建立文件
  ├── scripts // 存放自定义 javascript 脚本
  ├── source // 存放用户资源的地方
  |   ├── _drafts // 草稿文章
  |   └── _posts // 发布文章
  ├── themes // 存放博客的主题，Hexo会根据主题来生成静态页面
  ├── _config.yml // 博客的配置信息，你可以在此配置大部分的参数
  └── package.json
```

生成静态页面
``` bash
  $ hexo generate
```

启动本地服务，打开浏览器输入 http://localhost:4000/ 即可访问
``` bash
  $ hexo server
```

## 将博客托管到Github

### 配置 SSH Key，将本地目录与 Github 关联

配置SSH Key是让本地 git 项目与远程仓库建立联系。SSH Keys不配置的话每次项目有改动提交的时候就要手动输入账号密码，配置了就不需要了。   

首先检查是否已经有SSH Key
``` bash
  cd ~/.ssh
```
如果没有目录.ssh，则要生成一个新的SSH Key，执行：
``` bash
  ssh-keygen -t rsa -C "your e-mail"
```
接下来几步都直接按回车键，然后系统会要你输入密码。这个密码会在你提交项目时使用，如果为空的话提交项目时则不用输入。  

成功后进入到.shh文件夹中再输入ls，查看是否有id_rsa.pub文件
``` bash
  cd ~/.ssh
  ls
```

打开id_rsa.pub文件
``` bash
  cat id_rsa.pub
```

复制SSH Key后，去 github 的 https://github.com/settings/keys 页面配置，将其添加到Add SSH Key里。  

### 测试 SSH Key 是否配置成功    

执行：
``` bash
  ssh -T git@github.com
```

如配置了密码则要输入密码，输完按回车。如果显示以下内容，则说明Github中的 ssh 配置成功。
``` bash
  Hi username! You have successfully authenticated, but GitHub does not
  provide shell access.
```

### 创建仓库 Github Pages

<blockquote bgcolor=#FF4500>GitHub Pages 分两种，一种是你的 GitHub 用户名建立的 username.github.io 这样的用户/组织页，另一种是依附项目的pages。想建立个人博客是用的第一种，每个用户名下面只能建立一个。</blockquote>

登陆Github官网成功后，新建 New repository，建立与你github用户名对应的仓库，仓库名必须为 your_user_name.github.io  

### 修改Hexo的`_config.yml`文件

根目录`_config.yml`是博客的配置文件，以后修改博客会用到。  

现在我们需要修改`_config.yml`文件，来建立关联，执行命令：
``` bash
  vim _config.yml
```

找到相应部分并修改：
``` bash
  deploy:
    type: git
    repo: git@github.com:yourname/yourname.github.io.git,master
    branch: master
```

- 其中`yourname`替换成你的`Github`账户名;
- 注意在`yml`文件中，冒号后面都是要带空格的；

### 将博客项目上传到仓库

然后执行命令：
``` bash
  npm install hexo-deployer-git --save
```

然后执行命令：
``` bash
  hexo g #生成静态网页

  hexo d #部署到远程仓库
```

此时，通过访问 http://yourname.github.io 可以看到默认的 Hexo 首页

每次部署的命令：
``` bash
  hexo clean

  hexo generate

  hexo deploy

  或者 hexo g -d
```

一些常用命令：
``` bash
  hexo new "postName" #新建文章

  hexo new page "pageName" #新建页面

  hexo generate #生成静态页面至public目录

  hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）

  hexo deploy #将.deploy目录部署到GitHub

  hexo clean #清楚public文件夹，清除缓存数据

  hexo help #查看帮助

  hexo version #查看Hexo的版本

  hexo n == hexo new

  hexo g == hexo generate

  hexo s == hexo server

  hexo d == hexo deploy
```

## 添加标签和分类

### 添加分类
新建一个页面，命名为 categories
``` bash

 hexo new page categories
```

在 source 目录下会生成 categories 目录，修改 source/categories 目录的 index.md :
``` bash
  ---
  title: categories
  date: 2018-12-06 22:54:28
  type: "categories"
  ---
```

在主题的_config.yml 中取消注释:
``` bash
  categories: /categories
```

给模板添加分类属性，打开scarffolds文件夹里的post.md文件，给它的头部加上categories:，这样我们创建的所有新的文章都会自带这个属性，我们只需要往里填分类，就可以自动在网站上形成分类了。
``` bash
  title: {{ title }}
  date: {{ date }}
  categories:
  tags:
```

给文章添加分类，在要分类的文章顶部加入 category 属性，值为某个分类名:
``` bash
  ---
  title: 文章标题
  categories: 分类名
  date: 2018-12-09 17:46:34
  ---
```

### 添加标签
新建一个页面，命名为 tags
``` bash
 hexo new page tags
```

在 source 目录下会生成 tags 目录，修改 source/tags 目录的 index.md :
``` bash
  ---
  title: tags
  date: 2018-12-06 22:54:28
  type: "tags"
  ---
```

在主题的_config.yml 中取消注释:
``` bash
  tags: /tags
```

以后写文章时，在要分类的文章顶部加入 tags 属性，值为标签名:
``` bash
  ---
  title: 文章标题
  categories: 分类名
  tags: [a, b]      # 添加a和b两个标签
  date: 2018-12-09 17:46:34
  ---
```

上面是数组的形式，下面是短横线的形式：
``` bash
  ---
  title: 文章标题
  categories: 分类名
  date: 2018-12-09 17:46:34
  tags:
  - node.js
  - express
  ---
```

## 头部设置
在博客文章的开头会有对文章的说明文字，叫做文章头部，文章的头部除了可以设置文章标题、书写日期等基础信息外，还可以对文章添加标签、分类等，一个简单的示例如下:
```
  ---
  title: Title #标题
  date: YYYY-MM-DD HH:MM:SS #文件建立日期
  tags: #标签（不适用于分页）
  - 标签1
  - 标签2
  categories: #分类（不适用于分页）
  - 分类1
  - 分类2
  layout: #布局
  updated: YYYY-MM-DD HH:MM:SS #文件更新日期
  comments：true #开启文章的评论功能
  permalink：覆盖文章网址
  abbrlink：覆盖文章网址
  ---
```
