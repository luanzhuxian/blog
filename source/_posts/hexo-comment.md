---
title: Hexo + Next 添加 Valine 评论功能
comments: true
categories: Hexo
tags: Hexo
abbrlink: c49d1b87
date: 2019-04-23 17:14:10
---

# 前言
基于 [LeanCloud](https://leancloud.cn) 这家服务提供商，实现 Hexo 博客文章的浏览数统计功能。  
[Valine](https://valine.js.org/) 是基于 LeanCloud 的评论系统，评论数据都存储在 LeanCloud 平台，洁面很简洁，没有后台，删除和管理评论只能直接操作数据库。  

本文用的 Next 版本为 5.1.4，已经合并这个功能，相关代码在`themes\next\layout\_third-party\comments\valine.swig`，可以不用修改主题模版，直接在`_config.yml`中配置即可。如果低于这个版本的可以考虑升级或者自己手动修改。  

# 配置LeanCloud
在注册完成 LeanCloud 帐号并验证邮箱之后，我们就可以登录帐号。

## 1、创建一个开发版应用（免费）：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-application.png)
## 2、设置
在`LeanCloud > 设置 > 安全中心`中，把除`数据存储`外其他选项都关闭。并将你的博客域名添加到`Web 安全域名`中：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-setting.png)
## 3、创建Class
在`LeanCloud > 存储 > 创建Class`，选择`无限制的Class`并创建：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-class.png)
## 4、修改next配置
在`LeanCloud > 设置 > 应用 Key`中，找到`App ID`和`App Key`。之后修改 Next 的配置文件`_config.yml`如下：
```
  # Valine.
  # You can get your appid and appkey from https://leancloud.cn
  # more info please open https://valine.js.org
  valine:
    enable: true
    appid: xxxxxxxxx  # your leancloud application appid
    appkey: xxxxxxxxx # your leancloud application appkey
    notify: true # mail notifier , https://github.com/xCss/Valine/wiki
    verify: true # Verification code
    placeholder:  # comment box placeholder
    avatar:  # gravatar style
    guest_info: nick,mail,link # custom comment header
    pageSize: 10 # pagination size
```
- enable: 开启评论功能
- appid: leancloud 的 appid
- appkey: leancloud 的 appkey
- notify: 开启评论提醒，见下文
- verify: 评论前开启验证
- placeholder: 占位
- avatar: 头像，见下文
- guest_info: 评论框的 header 内容
- pageSize: 分页 


之后重新执行`hexo g -d`就可以看到文章下的评论框了：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-view.png)
评论成功后，在相应的表里能看新插入的数据，可以删除编辑：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-data.png)

## 5、其他
可在文章模板`scaffolds/post.md` 或文章头部中设置`comments`
```
  ---
  title: {{ title }}
  date: {{ date }}
  comments: true
  categories:
  tags:
  ---
```
在`source/categories/index.md`和`source/tags/index.md`里要禁用`comments`，否则分类和标签页面会显示评论框：
```
  ---
  title: categories
  date: 2018-12-06 22:54:28
  type: "categories"
  comments: false
  ---
```

# 头像配置
参考 **[Valine 评论系统中的头像配置](https://valine.js.org/avatar.html)**  

上面`valine > avatar`字段用来设置评论头像，可选值如下:
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-avatar_1.png)
之后注册登录[Gravatar](https://cn.gravatar.com)，并设置头像
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-avatar_2.png)
之后在`Next`配置文件中增加`avatar_cdn`字段，如下:
```
  valine:
    enable: true
    appid: xxxxxxxxx
    appkey: xxxxxxxxx
    notify: true # mail notifier , https://github.com/xCss/Valine/wiki
    verify: true # Verification code
    placeholder:  # comment box placeholder
    avatar:  # gravatar style
    guest_info: nick,mail,link # custom comment header
    pageSize: 10 # pagination size
    avatar_cdn: https://www.gravatar.com/avatar/
```
之后修改`Valine`模板文件`/themes/next/layout/_third-party/comments/valine.swig`，末尾增加`avatar_cnd`字段：
```
  new Valine({
      el: '#comments' ,
      verify: {{ theme.valine.verify }},
      notify: {{ theme.valine.notify }},
      appId: '{{ theme.valine.appid }}',
      appKey: '{{ theme.valine.appkey }}',
      placeholder: '{{ theme.valine.placeholder }}',
      avatar:'{{ theme.valine.avatar }}',
      guest_info:guest,
      pageSize:'{{ theme.valine.pageSize }}' || 10,
      avatar_cdn:'{{ theme.valine.avatar_cdn }}',
  });
```
刷新头像变成自定义的了：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-avatar_3.png)


# 邮件提醒
## 1、官方邮件提醒功能
参考 **[Valine 评论系统中的邮件提醒设置](https://valine.js.org/notify.html)**
**注意：目前邮件提醒正处于测试阶段，仅在子级对存在邮件地址的父级发表评论时发送邮件**   

`Valine`官方提供的邮件提醒功能是基于`Leancloud`的密码重置邮件提醒。所以要`开启email通知`除了修改配置文件`valine > notify`为`true`外，还需对`LeanCloud > 设置 > 邮件模板 > 用于重置密码的邮件主题`进行修改。如下图：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-notify_1.png)
可参考以下内容修改并保存，修改后的内容会被插入提醒邮件中：
```
  // 邮件主题
  你在{{appname}}的评论收到了新的回复

  // 内容
  <p>Hi, {{username}}</p>
  <p>
  你在 {{appname}} 的评论收到了新的回复，请点击查看：
  </p>
  <p><a href="https://luanzhuxian.github.io" style="display: inline-block; padding: 10px 20px; border-radius: 4px; background-color: #3090e4; color: #fff; text-decoration: none;">马上查看</a></p>
```

之后对一级评论回复并同时填写邮箱的话，就能收到邮件提醒了。  
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-notify_2.png)

## 第三方支持
还可以使用更完善的第三方邮件提醒：**[Valine-Admin](https://github.com/zhaojun1998/Valine-Admin)**  
[参考](https://deserts.io/valine-admin-document/)  
[参考](https://github.98.tn/hexo-valine-admin/)  

其中的设置云引擎的自定义环境变量：
- SITE_NAME : 网站名称
- SITE_URL : 网站地址, 最后不要加 / 
- SMTP_USER : SMTP 服务用户名，一般为邮箱地址
- SMTP_PASS : SMTP 密码，一般为授权码，而不是邮箱的登陆密码，请自行查询对应邮件服务商的获取方式
- SMTP_SERVICE : 邮件服务提供商
- SENDER_NAME : 寄件人名称
- TO_EMAIL：这个是填收邮件提醒的邮箱地址，若没有这个字段，则将邮件发到 SMTP_USER
- TEMPLATE_NAME：设置提醒邮件的主题，目前内置了两款主题，分别为 default 与 rainbow。默认为 default 