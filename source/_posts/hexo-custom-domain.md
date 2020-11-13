---
title: Github Page 添加自定义域名并开启 HTTPS + 支持七牛云图片
comments: true
categories: Hexo
tags: Hexo
abbrlink: a13d0f96
date: 2020-11-13 17:12:58
---

# 购买域名
首先没有域名的要去购买，这个就不多说了。

# 域名解析到 Github Page
购买域名的供应商会提供域名解析，我们的目的是将域名解析到你`github page`的 ip 地址。这个也不多说了，不清楚可以百度。或者参考我的。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/1.png)

# github 仓库添加域名解析记录
可以通过命令在`github page`仓库中添加`CNAME`文件:
```
    touch CNAME
    echo 'luanzhuxian.com'> CNAME
```
或者在仓库的`settings`中找到`Custom Domain`添加自己的域名

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/2.png)

之后就可以通过域名访问了。

# 支持 https 访问自定义域名
现在只能通过`http`访问域名，想要通过`https`访问，需要域名服务商颁发`ssl`证书，我是在阿里云买的域名，而阿里云的`ssl`证书是付费的。  
我们可以将域名解析服务迁移到提供免费`ssl`的服务商处，我选择了[Cloudflare](https://www.cloudflare.com/)。  

首先要注册，接着右上角`Add site`添加你的域名。之后`Cloudflare`会自动扫描你的`DNS`解析记录。完成后会自动显示你的域名当前DNS记录，如果记录有问题或者有遗漏，你可以自己手动`Add record`添加`DNS`解析，然后再点击到下一步。  

之后选择免费`CDN`套餐，点确定，`Cloudflare`会分配两个`CDN`加速的`NS`服务器地址。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/3.png)

之后登陆阿里云 > 控制台 > 产品与服务 > 域名 > 找到你的域名右侧点击管理 > 左侧菜单`DNS管理`：

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/4.png)

可以看到当前的阿里云的`DNS`服务器，我们要用`Cloudflare`的将之替代。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/5.png)

点右上角`修改DNS服务器`，将`Cloudflare`的两个`NS`地址分别复制进去，点确定。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/6.png)

也就是将域名的`DNS`解析服务从阿里云迁移到了提供免费证书的`Cloudflare`，生效后可以用`https`访问了。

# 支持七牛云图片
我的图片放到了[七牛](https://www.qiniu.com/)上，因为是免费的。  

首先要 > 控制台 > 左侧对象储存 > 空间管理 > 新建空间，就不详细说了。创建好右侧点击文件进入文件管理就可以上传文件了。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/7.png)

以前上传文件后文件的外链地址是七牛给的，比如`http://pw5hoox1r.bkt.clouddn.com/test.png`直接拿这个外链地址就能获取图片。现在不行了，必须要绑定已备案的域名，否则上传的文件没有外链地址。比如你绑定一个二级域名`cdn.abc.com`，绑定后图片的外链地址就变为`http://cdn.abc.com/test.png`。  

空间管理 > 点击右侧的域名，进入域名管理页面 > 添加域名。之后输入你的域名，必须是已备案的。通信协议的话`HTTP`是免费的，`HTTPS`是付费的。源站配置选择你的储存空间，点创建就行了。  

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/8.png)

之后要配置`CNAME`。去你的`DNS`服务商处添加一条`CNAME`的解析，将你七牛绑定的的域名解析到七牛的域名，这个域名就在刚创建的加速域名的详情页里可以找到。  

空间管理 > 域名管理 > 下方找到你刚绑定的域名，点进去。基本信息下面的`CNAME`就是了。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/9.png)

因为我上面选的`Cloudflare`，所以去添加一条`CNAME`的解析，目标就是刚刚七牛给的`CNAME`地址。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/10.png)

这里注意如果你添加了`a记录`，比如使用通配符`泛域名a记录`，有可能会和刚才添加的`CNAME`记录冲突，也就是刚才绑定的域名会被解析到`github page`而不是七牛，也就拿不到图片，所以可以把冲突的`a记录`删了。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/11.png)

生效后通过`https`打开博客，发现七牛的图片请求报错，原来是`https`下图片也被改为`https`请求的。要么去七牛的域名管理处改为支持`https`，但是付费的。或者去`Cloudflare`修改`ssl`证书。

进入`Cloudflare`点击上面的`SSL/TLS`，右边有四种模式：`OFF、Flexible、Full、Full(strict)`。默认是`Full`，也就是`客户端 到 Cloudflare`和`Cloudflare 到 服务器`这两段都是`https`加密传输。改为`Flexible`，即是`客户端 到 Cloudflare`是`https`加密传输，而`Cloudflare 到 服务器`是`http`传输，这样`Cloudflare`可以拿到七牛云的图片再返给客户端了。

![Github Page 添加自定义域名并开启 HTTPS](http://cdn.luanzhuxian.com/blog/hexo-custom-domain/12.png)

生效后再打开文章就可以看到图片了。