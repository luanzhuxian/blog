---
title: Github Page 添加自定义域名并开启 HTTPS
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