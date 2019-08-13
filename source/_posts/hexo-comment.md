---
title: Hexo + Next 添加 Valine 评论功能
comments: true
categories: Hexo
tags: Hexo
abbrlink: c49d1b87
date: 2019-04-23 17:14:10
---

## 前言
基于 [LeanCloud](https://leancloud.cn) 这家服务提供商，实现 Hexo 博客文章的浏览数统计功能。  
[Valine](https://valine.js.org/) 评论系统用的是 LeanCloud 作为数据库，洁面很简洁，没有后台，删除和管理评论只能直接操作数据库。  

本文用的 Next 版本为 5.1.4，已经合并这个功能，相关代码在`themes\next\layout\_third-party\comments\valine.swig`，可以不用修改主题模版，直接在`_config.yml`中配置即可。如果低于这个版本的可以考虑升级或者自己手动修改。  

## 配置LeanCloud
在注册完成 LeanCloud 帐号并验证邮箱之后，我们就可以登录帐号。

### 1、创建一个开发版应用（免费）：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-application.png)
### 2、设置
在`LeanCloud > 设置 > 安全中心`中，把除`数据存储`外其他选项都关闭。并将你的博客域名添加到`Web 安全域名`中：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-setting.png)
### 3、创建Class
在`LeanCloud > 存储 > 创建Class`，选择`无限制的Class`并创建：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-class.png)
### 4、修改next配置
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
    avatar: mm # gravatar style
    guest_info: nick,mail,link # custom comment header
    pageSize: 10 # pagination size
```
如果要`开启email通知`除了修改`_config.yml`文件之外还要将`LeanCloud > 设置邮件模板 > 用于重置密码的邮件主题`进行修改。  

之后重新`hexo g -d`就可以看到文章下的评论框了：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-view.png)
评论成功后，在相应的表里能看新插入的数据，可以删除编辑：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/comment-data.png)

## 其他
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
