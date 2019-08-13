---
title: Hexo + Next 添加文章阅读量统计
comments: true
categories: Hexo
tags: Hexo
abbrlink: ec069b41
date: 2018-12-09 17:46:34
---

## 前言
基于 [LeanCloud](https://leancloud.cn) 这家服务提供商，实现 Hexo 博客文章的浏览数统计功能。  

 Next 主题目前已经合并这个功能，相关代码在`themes\next\layout\_third-party\analytics\lean-analytics.swig`，可以不用修改主题模版，直接在`_config.yml`中配置即可。

## 配置LeanCloud
在注册完成 LeanCloud 帐号并验证邮箱之后，我们就可以登录帐号。

### 1、创建一个开发版应用（免费）：
我们新建一个应用来专门进行博客的访问统计的数据操作。首先，打开控制台点击创建应用：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud.png)
在接下来的页面，新建的应用名称我们可以随意输入，即便是输入的不满意我们后续也是可以更改的：  
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-application.png)

### 2、设置
在`LeanCloud > 设置 > 安全中心`中，`服务开关`部分只开启`数据存储`。  
因为`AppID`以及`AppKey`是暴露在外的，为了确保只用于我们自己的博客，建议开启`Web安全选项`，这样就只能通过我们自己的域名才有权访问后台的数据了，可以进一步提升安全性。`Web安全域名`下面要添加你的 Github Page 域名，来确保数据调用的安全：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-setting.png)

### 3、创建Class
在应用的数据配置界面，左侧数据栏下，下划线开头的都是系统预定义好的表，为了便于区分我们新建一张表来保存我们的数据。  
点击顶部的加号图标`新建Class`。在弹出的选项中选择`创建Class`用来专门保存我们博客的文章访问量等数据:
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-class.png)
**注意：**
- **为了保证我们前面对 NexT 主题的修改兼容，此处的<font color=red>Class名称必须为Counter</font>。**
- **由于 LeanCloud 升级了默认的 ACL 权限，如果你想避免后续因为权限的问题导致次数统计显示不正常，建议在此处选择无限制。**  

创建完成之后，左侧数据栏应该会多出一栏名为`Counter`的栏目，这个时候我们点击最左侧菜单栏的设置。  
在设置界面中，选择左侧的`应用Key`选项，即可发现我们创建应用的`App ID`以及`App Key`，有了它，我们就有权限能够通过主题中配置好的 Javascript 代码与这个应用的`Counter表`进行数据存取操作了:
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/leancloud-key.png)

### 4、修改next配置
复制`AppID`以及`AppKey`并在 Next 主题的`_config.yml`文件中我们相应的位置填入即可，正确配置之后文件内容像这个样子:
```
  leancloud_visitors:
    enable: true
    app_id: xscfkohc1AtS7Px8SMRn4SeR-gzGzoHsz
    app_key: qODRtEtDSVo4Mxj6DkhVAqd9
```
这个时候重新生成部署 Hexo 博客，应该就可以正常使用文章阅读量统计的功能了。需要特别说明的是：记录文章访问量的唯一标识符是文章的发布日期以及文章的标题，因此请确保这两个数值组合的唯一性，如果你更改了这两个数值，会造成文章阅读数值的清零重计。

## 后台管理
当你配置部分完成之后，初始的文章统计量显示为0，但是这个时候我们 LeanCloud 对应的应用的`Counter 表`中并没有相应的记录，只是单纯的显示为0而已，当博客文章在配置好阅读量统计服务之后第一次打开时，便会自动向服务器发送数据来创建一条数据，该数据会被记录在对应的应用的`Counter表`中。

- `url`字段被当作唯一`ID`来使用，因此如果你不知道带来的后果的话请不要修改。
- `title`字段显示的是博客文章的标题，用于后台管理的时候区分文章之用，没有什么实际作用。
- 其他字段皆为自动生成，具体作用请查阅 LeanCloud 官方文档，如果你不知道有什么作用请不要随意修改。
