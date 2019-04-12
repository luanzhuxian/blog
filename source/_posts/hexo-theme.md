---
title: Next 主题
comments: true
categories: Hexo
tags: Hexo
abbrlink: df6058cd
date: 2018-12-09 17:46:34
---

## 主题
我用的是 [next](http://theme-next.iissnan.com/) 主题

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
注意点：

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

### 添加评论
### 统计阅读次数
[Next主题添加文章阅读量统计功能]()

### SEO 优化
next 提供了 seo 优化选项，在主题配置文件 `_config.yml` 中有个选项是 seo，设置成 true 即开启了 seo 优化，会进行一些 seo 优化。
百度无法搜索到博客信息，是因为 Github Pages 屏蔽了百度爬虫，所以我将博客同步到两个平台上，一个 [Github](https://github.com/)，一个国内的 [Coding](https://coding.net/)。

### 添加 robots.txt
robots.txt 是搜索引擎蜘蛛协议，告诉引擎哪些要收录，哪些禁止收录。  
source 文件下新建 robots.txt，内容如下:
```
  User-agent: *
  Allow: /
  Allow: /categories/
  Allow: /tags/
  Allow: /archives/
  Disallow: /js/
  Disallow: /css/
  Disallow: /fonts/
  Disallow: /vendors/
  Disallow: /fancybox/

  Sitemap: https://luanzhuxian.github.io/sitemap.xml
  Sitemap: https://luanzhuxian.github.io/baidusitemap.xml
```

### 添加自定义js/css文件
- 首先把`js`文件放在`\themes\next\source\js\src`文件目录下
- 首先把`css`文件放在`\themes\next\source\css\src`文件目录下
- 找到`\themes\next\layout`目录下的布局文件`_layout.swig`
- 把引用代码加入到该文件中即可`<script type="text/javascript" src="/js/src/xxx.js"></script>`
- 也可以在`\themes\next\source\css\_custom\custom.styl`文件中进行样式的添加

## 第三方插件
### 博客压缩 ??? hexo-all-minifier
### 上传图片到七牛云 ???
在markdown中写blog的朋友，想必这点是最烦恼的吧，一般来说都要手动上传图片到七牛云，再把链接写到markdown中。
- 有人用phthon实现一个自动上传的脚本，
- 在github上找到一个一键贴图工具[qiniu-image-tool](https://github.com/jiwenxing/qimage-mac)，它支持本地文件、截图、网络图片一键上传七牛云并返回图片引用。Mac 是基于 Alfred 的，其 windows 也有相应版本windows版本。

### 将博客同时部署到 github 和 coding ???

按照其要求配置好以后，用截图软件截图后，或者本地图片后 copy，然后直接按设置好的 command+option+v，然后在图片成功上传到七牛云图床上，剪贴板上也有相应的连接。

### hexo-abbrlink 链接持久化
大家知道`hexo`默认的链接是 `http://xxx.yy.com/2018/07/14/hello-world` 这种类型的，这源于站点目录下的配置 `_config.yml` 里的配置 `:permalink: :year/:month/:day/:title/`，这种默认配置的缺点就是一般文件名是中文，导致`url`链接里有中文出现，这会造成很多问题，如使用`gitment`，也不利于`SEO`，另外年月日都会有分隔符。  
`hexo-abbrlink`这个插件，猜测是根据时间点算出的最终链接，这样就确保了博文链接的唯一化，只要不修改`md`文件的`abbrlink`的值，`url`就永久不会改变。如此`md`文件名和文件内容也可以随便改了。后面的层级更短，这样也有利于`SEO`优化。

- 安装：
```
  npm install hexo-abbrlink --save
```

- 配置：  
站点配置文件里:
```
  permalink: post/:abbrlink.html
  abbrlink:
   alg: crc32  # 算法：crc16(default) and crc32
   rep: hex    # 进制：dec(default) and hex
```
另外可以修改`scaffolds`里的模版文件，修改`post.md`为:
```
  ---
  title: {{ title }}
  date: {{ date }}
  comments: true
  categories:
  tags:
  ---
```
<blockquote bgcolor=#FF4500>
百度蜘蛛抓取网页的规则: 对于蜘蛛说网页权重越高、信用度越高抓取越频繁，例如网站的首页和内页。蜘蛛先抓取网站的首页，因为首页权重更高，并且大部分的链接都是指向首页。然后通过首页抓取网站的内页，并不是所有内页蜘蛛都会去抓取。
</blockquote>
搜索引擎认为对于一般的中小型站点，3层足够承受所有的内容了，所以蜘蛛经常抓取的内容是前三层，而超过三层的内容蜘蛛认为那些内容并不重要，所以不经常爬取。出于这个原因所以permalink后面跟着的最好不要超过2个斜杠。

### hexo-autonofollow
nofollow 标签是由谷歌领头创新的一个反垃圾链接的标签，并被百度、yahoo 等各大搜索引擎广泛支持，引用 nofollow 标签的目的是：用于指示搜索引擎不要追踪（即抓取）网页上的带有 nofollow 属性的任何出站链接，以减少垃圾链接的分散网站权重。
这里推荐 `hexo-autonofollow` 插件来解决。  
- 安装：
```
  npm install hexo-autonofollow  --save
```
- 配置：  
在站点配置文件中添加以下代码：
```
  nofollow:
    enable: true
    exclude: # 例外的链接，可将友情链接放置此处
    - exclude1.com
    - exclude2.com
```

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
  hexo douban   #生成读书、电影、游戏三个页面
  hexo douban -b  #生成读书页面
  hexo douban -m  #生成电影页面
  hexo douban -g  #生成游戏页面
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
    Books: /books/     #This is your books page
    Movies: /movies/   #This is your movies page
    Games: /games/     #This is your games page
```
