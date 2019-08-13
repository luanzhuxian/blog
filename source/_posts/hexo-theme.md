---
title: Next 主题
comments: true
categories: Hexo
tags: Hexo
abbrlink: df6058cd
date: 2018-12-09 17:46:34
---

## 主题
我用的是 [next](http://theme-next.iissnan.com/) 主题。  
**注意：我使用的`Hexo`版本为`3.8.0`，`Next`版本为`5.1.4`，也就是文章是基于上述版本写的。**

## 安装主题
进入 hexo 站点文件夹
``` bash
  $ cd your-hexo-site
```
拉取 Next 代码并存放到 themes/next 目录下
``` bash
  $ git clone https://github.com/iissnan/hexo-theme-next themes/next
```
 修改站点_config.yml 文件主题
```
  theme: next
```

## 目录结构
```
  ├── .github            # git信息
  ├── languages          # 多语言
  |   ├── default.yml    # 默认语言
  |   └── zh-Hans.yml    # 简体中文
  ├── layout             # 布局，根目录下的*.ejs文件是对主页，分页，存档等的控制
  |   ├── _custom        # 可以自己修改的模板，覆盖原有模板
  |   |   ├── _header.swig    # 头部样式
  |   |   ├── _sidebar.swig   # 侧边栏样式
  |   ├── _macro        # 可以自己修改的模板，覆盖原有模板
  |   |   ├── post.swig    # 文章模板
  |   |   ├── reward.swig    # 打赏模板
  |   |   ├── sidebar.swig   # 侧边栏模板
  |   ├── _partial       # 局部的布局
  |   |   ├── head       # 头部模板
  |   |   ├── search     # 搜索模板
  |   |   ├── share      # 分享模板
  |   ├── _script        # 局部的布局
  |   ├── _third-party   # 第三方模板
  |   ├── _layout.swig   # 主页面模板
  |   ├── index.swig     # 主页面模板
  |   ├── page           # 页面模板
  |   └── tag.swig       # tag模板
  ├── scripts            # script源码
  |   ├── tags           # tags的script源码
  |   ├── marge.js       # 页面模板
  ├── source             # 源码
  |   ├── css            # css源码
  |   |   ├── _common    # *.styl基础css
  |   |   ├── _custom    # *.styl局部css
  |   |   └── _mixins    # mixins的css
  |   ├── fonts          # 字体
  |   ├── images         # 图片
  |   ├── js             # javascript源代码
  |   └── lib            # 第三方库
  ├── _config.yml        # 主题配置文件
  └── README.md          
```

## 配置主题
接下来我们就可以来按需配置主题内容了，所有内容都在themes/next文件夹下的config.yml文件里修改。  

### 菜单栏
原生菜单栏有主页、关于、分类、标签等数个选项，但是在配置文件中是注释掉的状态，这里我们自行修改注释就行。
```
  menu:
   home: / || home
   # about: /about/ || user
   tags: /tags/ || tags
   categories: /categories/ || th
   archives: /archives/ || archive
   # schedule: /schedule/ || calendar
   # sitemap: /sitemap.xml || sitemap
   # commonweal: /404/ || heartbeat
```
注意：
- 如果事先没有通过hexo new page <pageName>来创建页面的话，即使在配置文件中取消注释，页面也没法显示
- || 后面是fontAwesome里的文件对应的名称
- menu_icons记得选enable: true（默认应该是true）

### 设置头像
修改主题_config.yml 文件
```
 avatar: http://....  # 头像的URL或路径
```

### 主题风格
主题提供了4个，我们把想要选择的取消注释，其他三个保持注释掉的状态即可。
```
# Schemes
# scheme: Muse
# scheme: Mist
# scheme: Pisces
scheme: Gemini
```

### 底部建站时间和图标修改
```
footer:
  # Specify the date when the site was setup.
  # If not defined, current year will be used.
  since: 2018

  # Icon between year and copyright info.
  icon: envira

  # If not defined, will be used `author` from Hexo main config.
  copyright:
  # -------------------------------------------------------------
  # Hexo link (Powered by Hexo).
  powered: false

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    enable: false
    # Version info of NexT after scheme info (vX.X.X).
    version: false
  #
```
我在这部分做了这样几件事，使底部信息更简单：

- 把用户的图标从 user 改成了 envira
- copyright 留空
- powered 设为 false 把 hexo 的授权图片取消了
- theme 的 enable 设为 false 把主题的内容也取消了  

修改后的footer如下图：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/blog-footer.png)

### 统计文章字数和阅读时间
```
post_wordcount:
  item_text: true
  wordcount: false  # 文章字数
  min2read: false   # 阅读时间
  totalcount: false # 总共字数
  separated_meta: true
```
我在这里关闭了字数统计，使底部信息更简单  

### 个人社交信息
在 social 里我们可以自定义自己想要在个人信息部分展现的账号，同时给他们加上图标。
```
  social:
    GitHub: https://github.com/yourname || github
    E-Mail: mailto:xxx@hotmail.com || envelope
    #Google: https://plus.google.com/yourname || google
    #Twitter: https://twitter.com/yourname || twitter
    #FB Page: https://www.facebook.com/yourname || facebook
```

### 博客主页自定义样式修改
打开博客根目录`/themes/next/source/css/_custom/custom.styl`文件，修改自己想要的主页样式就可以，会覆盖主题的样式。

### 添加自定义js/css文件
- 首先把`js`文件放在`\themes\next\source\js\src`文件目录下
- 首先把`css`文件放在`\themes\next\source\css\src`文件目录下
- 找到`\themes\next\layout`目录下的布局文件`_layout.swig`
- 把引用代码加入到该文件中即可`<script type="text/javascript" src="/js/src/xxx.js"></script>`
- 也可以在`\themes\next\source\css\_custom\custom.styl`文件中进行样式的添加


### 网站动画效果
开关网站的动画。
```
  motion:
    enable: false
```
主题自带四种动画效果，可以选自己喜欢的。
```
  motion:
    enable: true
    async: true

  # Canvas-nest
  canvas_nest: true

  # three_waves
  three_waves: false

  # canvas_lines
  canvas_lines: false

  # canvas_sphere
  canvas_sphere: false
```

### 设置网站图标
- 找`16*16`与`32*32`的icon图标，并将图标名称改为`favicon16.ico`与`favicon32.ico`。
- 把图标放在`/themes/next/source/images`或者放在根目录的`/source/images`文件夹里。
- 在主题配置文件`_config`内搜索`favicon`字段，把`small`、`medium`字段的地址修改为`/images/favicon16.ico`与`/images/favicon32.ico`。。

### 网站标题栏背景颜色
打开`themes/next/source/css/_custom/custom.styl`，在里面写下如下代码：
```
  .site-meta {
    background: #FF0033; //修改为自己喜欢的颜色
  }
```

### 添加Fork me on GitHub
打开 [此链接](https://github.com/blog/273-github-ribbons) 挑选自己喜欢的样式，并复制代码，添加到`themes\next\layout\_layout.swig`的相应标签内即可，记得把`<a href="https://github.com/you">`里面的url换成自己的github地址    
我添加到`<main id="main" class="main">`标签下，并修改了样式，如下：
```
  <main id="main" class="main">
    <a href="https://github.com/luanzhuxian" style="display:block; position:absolute; top:3px ; left:0; border:none;">
      <img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_left_orange_ff7600.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
    </a>
```

### 添加静态背景
打开博客根目录`/themes/next/source/css/_custom/custom.styl`文件，编辑如下：
```
  // Custom styles.
  body {
      background-image: url(/images/xxx.png); // 动图也可以添加
      background-attachment: fixed; // 不随屏幕滚动而滚动
      background-repeat: repeat; // 如果背景图不够屏幕大小则重复铺，改为no-repeat则表示不重复铺
      background-size: contain; // 等比例铺满屏幕
```

### 添加动态背景
在`themes\next\layout\_layout.swig`文件`</body>`标签前添加如下内容：
```
  {% if theme.canvas_nest %}
    <script type="text/javascript" src="//cdn.bootcss.com/canvas-nest.js/1.0.0/canvas-nest.min.js"></script>
  {% endif %}
```
修改主题配置文件`next/_config.yml`如下：
```
  # Canvas-nest
  canvas_nest: true
```

### 限制首页显示字数
博客首页会显示文章的内容（默认显示文章的全部内容），如果当文章太长的时候就会显得十分冗余，所以我们有必要对其进行精简。
在主题配置文件中找到`auto_excerpt`，将`enable`变为`true`
```
  # Automatically Excerpt. Not recommend.
  # Please use <!-- more --> in the post to control excerpt accurately.
  auto_excerpt:
    enable: true
    length: 150 #长度可自由调节
```

### 加载页面顶部显示进度条
在主题的`_config`文件，
```
  # Progress bar in the top during page loading.
    pace: true
    pace_theme: pace-theme-minimal
```

### 增加回到顶部按钮及显示当前浏览进度
主题配置文件搜索`b2t`字段，改为`true`即可，（注意此功能只能用于`Pisces`和`Gemini`主题）。
```
  # Back to top in sidebar (only for Pisces | Gemini).
    b2t: true

    # Scroll percent label in b2t button.
    # scrollpercent字段设置为true即可实现当前浏览进度的显示。
    scrollpercent: true

    # Enable sidebar on narrow view (only for Muse | Mist).
    onmobile: true
```

### 文章目录
首先文章要有标题，所谓标题就是例如这种一级标题(#)，二级标题(##)，三级标题(###)的。
在主题的`_config`文件里面，将`toc`的`enable`设置为`true`，默认的目录是有序号的，如果你不想要序号，你需要把`number`置为`false` 。
```
  # Table Of Contents in the Sidebar
  toc:
    enable: true
    number: true
    wrap: false
```

### 增加本地搜索功能
首先安装插件，根目录命令行输入:
```
  npm install hexo-generator-searchdb --save
```
编辑博客配置文件，新增以下内容到任意位置：
```
  search:
    path: search.xml
    field: post
    format: html
    limit: 10000
```
主题配置文件搜索local_search字段，设置enable为true
```
  # Local search
  local_search:
    enable: true
```
开启此功能成功后，在博客菜单栏会多一项搜索，点击后即可搜索


### 添加图片懒加载
博客根目录打开命令输入（若主题已包含则不用安装）:
```
  git clone https://github.com/theme-next/theme-next-jquery-lazyload themes/next/source/lib/jquery_lazyload
```
然后在配置文件中搜索`lazyload`,将其修改为true
```
  # Added switch option for separated repo in 6.0.0.
  # Dependencies: https://github.com/theme-next/theme-next-jquery-lazyload
  lazyload: true
```
但是开启`lazyload`后博客的所有文字内容都无法加载，不知为何原因，所以我没有启用懒加载


### 添加评论
[Hexo + Next添加 Valine 评论功能](https://luanzhuxian.github.io/post/c49d1b87.html)  

### 统计阅读次数
[Hexo + Next添加文章阅读量统计](https://luanzhuxian.github.io/post/ec069b41.html)  

### SEO
[Hexo + Next主题博客提交百度谷歌收录](https://luanzhuxian.github.io/post/82d92ad4.html)  

### 压缩
[使用 Gulp 压缩 Hexo](https://luanzhuxian.github.io/post/e5ac3b51.html)  

### 增加七牛图床
将图片上传至七牛，然后获得外链，在我们使用markdown写博客的时候直接插入外链。还可以直接获取带水印、压缩、剪裁过后的图片。  

首先打开 [七牛](https://portal.qiniu.com/)，注册登录，实名认证。  
之后在左侧找到对象存储，第一次要新建存储空间：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/qiniu-space.png-watermark)
之后在该`存储空间 > 内容管理 > 上传文件`上传图片：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/qiniu-uplpad.png-watermark)
上传后可以在`存储空间 > 内容管理`图片列表管理图片，还可以找到图片的外链，直接在文章中使用即可。
![avatar](http://pw5hoox1r.bkt.clouddn.com/qiniu-list.png-watermark)
另外在图片样式下可以对图片进行处理，比如缩放、裁剪、增加水印、设置输出格式等。使用时只要在图片外链后加上设置的样式分隔符和样式名称，即可得到处理后的图片。  
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/qiniu-style.png-watermark)

## 第三方插件

### hexo-douban
[`hexo-douban`](https://github.com/mythsman/hexo-douban) 插件可以在博客中添加豆瓣电影、读书和游戏页面，关联我们自己的账号。  

- 安装：
```
  npm install hexo-douban --save
```

- 配置：  
在 hexo 根目录下的 config.yml 文件中添加如下内容
```
  douban:
    user: 你的豆瓣userid
    builtin: false
    book:
      title: 'This is my book title'
      quote: 'This is my book quote'
    movie:
      title: 'This is my movie title'
      quote: 'This is my movie quote'
    game:
      title: 'This is my game title'
      quote: 'This is my game quote'
    timeout: 10000
```
title 和 quote 后面的内容会分别作为电影/读书/游戏页面的标题和副标题（引言）呈现在博客里。  
user 就写我们豆瓣的 id，可以在我的豆瓣页面中找到。builtin 指是否将生成页面功能嵌入 hexo s 和 hexo g 中，建议选 false，因为true会导致页面每次启动本地服务器都需要很长时间生成豆瓣页面。  

- 生成页面：
```
  hexo douban   # 生成读书、电影、游戏三个页面
  hexo douban -b  # 生成读书页面
  hexo douban -m  # 生成电影页面
  hexo douban -g  # 生成游戏页面
```

- 在博客中生成页面：
```
  hexo new page books
  hexo new page movies
  hexo new page games
```

- 在博客中添加页面：  
在menu部分添加我们需要添加的页面名称和相对路径
```
  menu:
    home: /
    categories: /categories/
    archives: /archives/
    Books: /books/     # This is your books page
    Movies: /movies/   # This is your movies page
    Games: /games/     # This is your games page
```
