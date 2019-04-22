---
title: Hexo + Next主题博客提交百度谷歌收录
comments: true
abbrlink: 82d92ad4
date: 2019-04-22 13:54:37
categories: Hexo
tags: Hexo
---
<blockquote bgcolor=#FF4500>SEO（Search Engine Optimization）：中文译为搜索引擎优化，即利用搜索引擎的规则提高网站搜索引擎内自然排名。主要通过站内优化比如网站结构调整、网站内容建设、网站代码优化等以及站外优化等方式实现。</blockquote>

主要是给各个搜索引擎提交你的sitemap，让别人能搜到你博客的内容。  
先确认博客是否被搜索引擎收录，在百度或者谷歌输入下面格式来判断，如果能搜索到就说明被收录，否则就没有。
```
  site:写你要搜索的域名 # site:xxx.github.io
```

## 开启Next主题的SEO优化项
`Next`提供了`seo`优化选项，在主题配置文件`_config.yml`中有个选项是`seo`，设置成`true`即开启了`seo`优化，会进行一些`seo`优化。
百度无法搜索到博客信息，是因为`Github Pages`屏蔽了百度爬虫，所以我将博客同步到两个平台上，一个 [Github](https://github.com/)，一个国内的 [Coding](https://coding.net/)。

## 让百度收录博客
打开[百度站长平台](https://ziyuan.baidu.com/)，注册登陆后，提示要绑定`熊掌ID`，注册验证绑定`熊掌ID`。
之后在`用户中心 > 站点管理`下添加网站。根据提示输入站点地址等信息，建议输入的域名为`www`开头的，不要输入`github.io`的，因为`github`是不允许百度的`spider`爬取`github`上的内容的，所以如果想让你的站点被百度收录，只能使用自己购买的域名。

### 验证站点  
在选择完网站的类型之后需要验证网站的所有权，有三种验证方式，文件验证、html标签验证、cname解析验证。
#### 1、文件验证
- 下载验证文件
- 将验证文件放置于您所配置域名的根目录下，即放在博客的本地根目录的`source`文件夹下。
- 控制台输入`hexo g -d`，部署更新。
- 根据提示检查是否验证文件可以正常访问
- 点击完成验证按钮  
**注意：使用文件验证文件存放的位置需要放在`source`文件夹下，如果是`html`文件会被`hexo`编译导致之后验证不通过，所以必须要加上的`layout:false`，这样就不会被`hexo`编译。（如果验证文件是txt格式的就不需要）**  

#### 2、HTML标签验证
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
- 然后控制台输入`hexo g -d`，部署更新。
- 最后点击完成验证按钮  

#### 3、cname解析验证
只需添加一条解析  

### 生成sitemap站点地图
<blockquote bgcolor=#FF4500>站点地图是一种文件，您可以通过该文件列出您网站上的网页，从而将您网站内容的组织架构告知Google等搜索引擎。搜索引擎网页抓取工具会读取此文件，以便更加智能地抓取您的网站。</blockquote>
我们需要使用插件自动生成网站的`sitemap`，然后将生成的`sitemap`提交到百度和其他搜索引擎。  
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
之后重新打包`hexo g -d`，若在你的博客根目录的`public`下面发现生成了`sitemap.xml`以及`baidusitemap.xml`就表示成功了，其中`sitemap.xml`文件是搜索引擎通用的文件，`baidusitemap.xml`是百度专用的`sitemap`文件。可以通过`https://xxx.github.io/baidusitemap.xml`查看该文件。

### 向百度提交链接
之后就可以将生成的`sitemap`文件提交给百度，可加快爬虫抓取速度。  
还是在百度站长平台，找到`网站支持 > 数据引入 > 链接提交`。这里我们可以看到有两种提交方式，自动提交和手动提交，自动提交又分为主动推送、自动推送和`sitemap`。  
如何选择链接提交方式：
- 自动提交：
  - 主动推送：最为快速的提交方式，推荐您将站点当天新产出链接立即通过此方式推送给百度，以保证新链接可以及时被百度收录。
  - 自动推送：最为便捷的提交方式，请将自动推送的JS代码部署在站点的每一个页面源代码中，部署代码的页面在每次被浏览时，链接会被自动推送给百度。可以与主动推送配合使用。 。
  - sitemap：您可以定期将网站链接放到sitemap中，然后将sitemap提交给百度。百度会周期性的抓取检查您提交的sitemap，对其中的链接进行处理，但收录速度慢于主动推送。
- 手动提交：在`数据引入 > 手动提交`下一次性填写链接地址，并提交给百度。  

一般主动提交比手动提交效果好，这里介绍主动提交的三种方法。从效率上来说：`主动推送>自动推送>sitemap`。

#### 1、主动推送
安装插件：
```
npm install hexo-baidu-url-submit --save
```
根目录配置文件`_config.ym`新增字段：
```
  baidu_url_submit:
    count: 100 # 提交最新的一个链接
    host: xxx.github.io # 在百度站长平台中注册的域名
    token: xxxxxx # 秘钥，百度站长平台 > 推送接口 > 接口调用地址中token字段
    path: baidu_urls.txt # 文本文档的地址， 新链接会保存在此文本文档里
    xz_appid: xxxxxx # 你的熊掌号 appid
```
其次，记得查看`_config.ym`文件中`url`， 必须是百度站长平台注册的域名（包含www）：
```
  # URL
  url: https://xxx.github.io/
  root: /
  permalink: post/:abbrlink.html
```
最后，根目录配置文件新增deploy：
```
  deploy:
    type: baidu_url_submitter
```
**注意：参考 [hexo官网](https://hexo.io/docs/deployment.html) 多个deploy时要这样写，前面加横杠：**
```
  # You can use multiple deployers. Hexo will execute each deployer in order.
  deploy:
  - type: git
    repo:
  - type: heroku
    repo:
```
执行`hexo deploy`，新的链接就会被推送了

#### 2、自动推送
在主题配置文件下设置，将`baidu_push`设置为`true`：
```
  # Enable baidu push so that the blog will push the url to baidu automatically which is very helpful for SEO
  baidu_push: true
```
然后查看`themes/next/layout/_third-party/seo/baidu-push.swig`文件中是否包含如下百度提供的自动推送代码，没有的话要添加：
```
  {% if theme.baidu_push %}
  <script>
  (function(){
      var bp = document.createElement('script');
      var curProtocol = window.location.protocol.split(':')[0];
      if (curProtocol === 'https') {
          bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
      }
      else {
          bp.src = 'http://push.zhanzhang.baidu.com/push.js';
      }
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(bp, s);
  })();
  </script>
  {% endif %}
```
这样每次访问博客中的页面就会自动向百度提交`sitemap`。

#### 3、sitemap
将上面生成的`sitemap`文件，填写到`请填写数据文件地址`下面的文本框，再提交就可以了，如：
```
  https://xxx.github.io/sitemap.xml
  https://xxx.github.io/baidusitemap.xml
```

## 让谷歌收录博客
[google站点平台](https://www.google.com/webmasters/)，首先登陆注册。
### 验证站点
也是有几种方法：
- `Domain`验证
- `URL prefix`验证，包含以下验证方法：
  - HTML file（文件验证）
  - HTML taghtml（标签验证）
  - Google Analytics
  - Google Tag Manager
  - Google name provider  

`URL prefix`验证下的，文件验证、标签验证和百度类似，我选的标签验证，在主题配置文件中修改：
```
  # Google Webmaster tools verification setting
  # See: https://www.google.com/webmasters/
  google_site_verification: xxxxxxxxxxxxx # 此处改为google提供给你的字段
```

### 提交sitemap
打开 [google search console](https://search.google.com/search-console/)，点击左侧'sitemap'栏，在`Add a new sitemap`下面添加，如：
```
  https://xxx.github.io/sitemap.xml
```
最后在`google`搜索你的站点地址，如：`site:xxx.github.io`来检查是否收录成功。

## 添加 robots.txt
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

## hexo-abbrlink 链接持久化
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
<blockquote bgcolor=#FF4500>百度蜘蛛抓取网页的规则: 对于蜘蛛说网页权重越高、信用度越高抓取越频繁，例如网站的首页和内页。蜘蛛先抓取网站的首页，因为首页权重更高，并且大部分的链接都是指向首页。然后通过首页抓取网站的内页，并不是所有内页蜘蛛都会去抓取。</blockquote>
搜索引擎认为对于一般的中小型站点，3层足够承受所有的内容了，所以蜘蛛经常抓取的内容是前三层，而超过三层的内容蜘蛛认为那些内容并不重要，所以不经常爬取。出于这个原因所以permalink后面跟着的最好不要超过2个斜杠。

## hexo-autonofollow
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
