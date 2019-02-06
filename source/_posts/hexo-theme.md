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

#### 菜单栏
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

#### 设置头像
修改主题_config.yml 文件
```
 avatar: http://....  # 头像的URL或路径
```

#### 主题风格
主题提供了4个，我们把想要选择的取消注释，其他三个保持注释掉的状态即可。

#### 底部建站时间和图标修改

#### 个人社交信息
在 social 里我们可以自定义自己想要在个人信息部分展现的账号，同时给他们加上图标。
```
  social:
    GitHub: https://github.com/XuQuan-nikkkki || github
    E-Mail: mailto:xuquan1225@hotmail.com || envelope
    #Google: https://plus.google.com/yourname || google
    #Twitter: https://twitter.com/yourname || twitter
    #FB Page: https://www.facebook.com/yourname || facebook
```

#### 网站动画效果
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




#### 添加评论
#### 统计文章字数和阅读时间
#### 统计阅读次数
