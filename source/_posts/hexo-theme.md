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

### 博客主页自定义样式修改
打开博客根目录`/themes/next/source/css/_custom/custom.styl`文件，修改自己想要的主页样式就可以。

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

### 添加静态背景
打开博客根目录`/themes/next/source/css/_custom/custom.styl`文件，编辑如下：
```
  // Custom styles.
  body {
      background-image: url(/images/xxx.png); //动图也可以添加
      background-attachment: fixed; // 不随屏幕滚动而滚动
      background-repeat: repeat; // 如果背景图不够屏幕大小则重复铺，改为no-repeat则表示不重复铺
      background-size: contain; // 等比例铺满屏幕
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

### 左侧文章目录
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
开启此功能成功后，在博客左侧菜单栏会多一项搜索，点击后即可搜索


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
可在文章模板（scaffolds/post.md） / 文章头部中设置`comments`
```
  ---
  title: {{ title }}
  date: {{ date }}
  comments: true
  categories:
  tags:
  ---
```
### 统计阅读次数
[Next主题添加文章阅读量统计功能]()  


### 让百度谷歌收录我们的博客
打开[百度站长平台](https://ziyuan.baidu.com/)，注册登陆后，提示要绑定`熊掌ID`，注册验证绑定`熊掌ID`后，在`用户中心` > `站点管理`下添加网站。根据提示输入域名等信息，建议输入的域名为`www`开头的，不要输入`github.io`的，因为`github`是不允许百度的`spider`爬取`github`上的内容的，所以如果想让你的站点被百度收录，只能使用自己购买的域名。   
之后需要验证，有三种验证方式，这里说前两种。
#### 文件验证
- 下载验证文件
- 将验证文件放置于您所配置域名的根目录下，即放在博客的本地根目录的`source`文件夹下，注意`html`文件会被`hexo`编译导致之后验证不通过，所以必须要加上的`layout:false`，这样就不会被`hexo`编译。然后控制台输入`hexo g -d`，部署更新。
- 根据提示检查是否验证文件可以正常访问
- 点击完成验证按钮
#### HTML标签验证
- 方法一：打开`themes/next/layout/_partials/head.swig`文件，将百度站长给你的`meta`标签添加上：
```
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <meta name="theme-color" content="{{ theme.android_chrome_color }}">
  <meta name="baidu-site-verification" content="lsIWHEaglh" />  # 此为新添加的
```
- 方法二：打开`Hexo`主题配置文件，按如下修改/添加：
```
  google_site_verification: #索引擎提供给你的HTML标签的content后的内容
  baidu_site_verification: #索引擎提供给你的HTML标签content后的内容
```
然后控制台输入`hexo g -d`，部署更新。
- 最后点击完成验证按钮


### 生成sitemap站点地图
<blockquote bgcolor=#FF4500>
站点地图是一种文件，您可以通过该文件列出您网站上的网页，从而将您网站内容的组织架构告知Google等搜索引擎。搜索引擎网页抓取工具会读取此文件，以便更加智能地抓取您的网站。
</blockquote>

先确认博客是否被搜索引擎收录，在百度或者谷歌输入下面格式来判断，如果能搜索到就说明被收录，否则就没有。
```
  site:写你要搜索的域名 # site:xxx.github.io
```
先安装谷歌和百度的插件，如下：
```
  npm install hexo-generator-sitemap --save
  npm install hexo-generator-baidu-sitemap --save
```
在博客根目录的`_config.yml`中改`url`为你的站点地址：
```
  # URL
  ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
  url: https://luanzhuxian.github.io/
  root: /
  # permalink: :year/:month/:day/:title/
  permalink: post/:abbrlink.html
  permalink_defaults:
```
在博客根目录的`_config.yml`中添加如下代码：
```
  baidusitemap:
    path: baidusitemap.xml
  sitemap:
    path: sitemap.xml
```
之后重新打包`hexo g -d`，若在你的博客根目录的`public`下面发现生成了`sitemap.xml`以及`baidusitemap.xml`就表示成功了。可以通过`https://xxx.github.io/baidusitemap.xml`查看该文件。


### 设置自动推送
在主题配置文件下设置，将`baidu_push`设置为`true`：
```
  # Enable baidu push so that the blog will push the url to baidu automatically which is very helpful for SEO
  baidu_push: true
```
之后提交生成的`baidusitemap.xml`给[百度站长平台](http://ziyuan.baidu.com/linksubmit/index)，有两种提交方式：
- 自动提交：
- 手动提交：在`数据引入` > `手动提交`下填写链接地址并提交。

### SEO 优化
`Next`提供了`seo`优化选项，在主题配置文件`_config.yml`中有个选项是`seo`，设置成`true`即开启了`seo`优化，会进行一些`seo`优化。
百度无法搜索到博客信息，是因为`Github Pages`屏蔽了百度爬虫，所以我将博客同步到两个平台上，一个 [Github](https://github.com/)，一个国内的 [Coding](https://coding.net/)。

### 添加 robots.txt
`robots.txt`是搜索引擎蜘蛛协议，告诉引擎哪些要收录，哪些禁止收录。  
`source`文件夹下新建robots.txt，内容如下:
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
