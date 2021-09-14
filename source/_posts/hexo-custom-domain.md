---
title: Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片
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

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/1.png)

# github 仓库添加域名解析记录
可以通过命令在`github page`仓库中添加`CNAME`文件:
```
    touch CNAME
    echo 'luanzhuxian.com'> CNAME
```
或者在仓库的`settings`中找到`Custom Domain`添加自己的域名

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/2.png)

之后就可以通过域名访问了。

# 支持 https 访问自定义域名
现在只能通过`http`访问域名，想要通过`https`访问，需要域名服务商颁发`SSL`证书，我是在阿里云买的域名，而阿里云的`SSL`证书是付费的。  
我们可以将域名解析服务迁移到提供免费`SSL`的服务商处，我选择了[Cloudflare](https://www.cloudflare.com/)。  

首先要注册，接着右上角`Add site`添加你的域名。之后`Cloudflare`会自动扫描你的`DNS`解析记录。完成后会自动显示你的域名当前DNS记录，如果记录有问题或者有遗漏，你可以自己手动`Add record`添加`DNS`解析，然后再点击到下一步。  

之后选择免费`CDN`套餐，点确定，`Cloudflare`会分配两个`CDN`加速的`NS`服务器地址。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/3.png)

之后登陆阿里云 > 控制台 > 产品与服务 > 域名 > 找到你的域名右侧点击管理 > 左侧菜单`DNS管理`：

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/4.png)

可以看到当前的阿里云的`DNS`服务器，我们要用`Cloudflare`的将之替代。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/5.png)

点右上角`修改DNS服务器`，将`Cloudflare`的两个`NS`地址分别复制进去，点确定。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/6.png)

也就是将域名的`DNS`解析服务从阿里云迁移到了提供免费证书的`Cloudflare`，生效后可以用`https`访问了。

# 支持七牛云图片
我的图片放到了[七牛](https://www.qiniu.com/)上，因为是免费的。  

首先要 > 控制台 > 左侧对象储存 > 空间管理 > 新建空间，就不详细说了。创建好右侧点击文件进入文件管理就可以上传文件了。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/7.png)

以前上传文件后文件的外链地址是七牛给的，比如`http://pw5hoox1r.bkt.clouddn.com/test.png`直接拿这个外链地址就能获取图片。现在不行了，必须要绑定已备案的域名，否则上传的文件没有外链地址。比如你绑定一个二级域名`cdn.abc.com`，绑定后图片的外链地址就变为`http://cdn.abc.com/test.png`。  

空间管理 > 点击右侧的域名，进入域名管理页面 > 添加域名。之后输入你的域名，必须是已备案的。通信协议的话`HTTP`是免费的，`HTTPS`是付费的。源站配置选择你的储存空间，点创建就行了。  

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/8.png)

之后要配置`CNAME`。去你的`DNS`服务商处添加一条`CNAME`的解析，将你七牛绑定的的域名解析到七牛的域名，这个域名就在刚创建的加速域名的详情页里可以找到。  

空间管理 > 域名管理 > 下方找到你刚绑定的域名，点进去。基本信息下面的`CNAME`就是了。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/9.png)

因为我上面选的`Cloudflare`，所以去添加一条`CNAME`的解析，目标就是刚刚七牛给的`CNAME`地址。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/10.png)

这里注意如果你添加了`a记录`，比如使用通配符`泛域名a记录`，有可能会和刚才添加的`CNAME`记录冲突，也就是刚才绑定的域名会被解析到`github page`而不是七牛，也就拿不到图片，所以可以把冲突的`a记录`删了。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/11.png)

生效后通过`https`打开博客，发现七牛的图片请求报错，原来是`https`下图片也被改为`https`请求的。要么去七牛的域名管理处改为支持`https`，但是付费的。或者去`Cloudflare`修改`SSL`证书。

进入`Cloudflare`点击上面的`SSL/TLS`，右边有四种模式：`OFF、Flexible、Full、Full(strict)`。默认是`Full`，也就是`客户端 到 Cloudflare`和`Cloudflare 到 服务器`这两段都是`https`加密传输。  

改为`Flexible`，即是`客户端 到 Cloudflare`是`https`加密传输，而`Cloudflare 到 服务器`是`http`传输，这样`Cloudflare`可以拿到七牛云的图片再返给客户端了。

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/12.png)

生效后再打开文章就可以看到图片了。

<br/>
<font color=#dd0000 size=5> 。。。。。。。 以下内容更新于2021.09.14 。。。。。。。 </font>    
<br/>

发现七牛可以给空间绑定的域名申请免费`SSL`证书了，那么我们的放在七牛上的图片就可以支持`https`访问了。    

对象存储 > 空间管理 > 域名管理 > 找到相应域名点详情 > 找到HTTPS配置 > 修改配置，`HTTPS`的按钮默认是关着的，打开它，下面出现三个单选框，选免费证书，就可以申请了。  

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/13.png)

我是在`SSL`证书管理页面直接申请证书，所以上述申请的后续流程不清楚，现在说一下单独申请证书的流程，应该两者差不多：  

1、控制台 > SSL证书 > 购买证书，证书品牌和证书种类都选择带限免的，直接零元购买。  

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/14.png)

2、购买后在证书管理页就能看到了，但还要补充信息，补全信息页面域名填你存放图片空间绑定的那个域名，公司信息自己看着填，能通过表单校验就行了，比如写个无也是能通过的。  

3、之后提交，下一步还要对域名做验证，看是不是你自己的域名，选择`DNS`验证，将`TXT 记录名`和`TXT 记录值`记下来，接下来去你域名的`DNS`服务商，这里是去`Cloudflare`，在你域名下添加一条`TXT`记录，记录的`name`和`content`分别填刚才的`TXT 记录名`和`TXT 记录值`再等个十几分钟审核就通过了，证书就申请成功了。  

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/17.png)
![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/18.png)


4、之后回到域名详情页 > 找到`HTTPS配置` > 修改配置，打开`HTTPS`的按钮，下面出现三个单选框，选已有证书，在下拉菜单中只能看到用该域名申请的证书，因为此免费证书是为了开发人员方便，只能和你添加的同名域名搭配使用。 

![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/15.png)

之后点确认生效后去复制该空间的文件外链，会变为`https`，在浏览器中尝试看能不能打开图片，能的话说明配置成功了。如果不能访问，要看是什么问题，比如`Cloudflare`无法解析该域名，可能是和添加的`CNAME`记录和某个`A`记录冲突了，会先匹配`A`记录，则把该`A`记录停止或删除即可。  

5、因为图片可以支持`https`了，所以`Cloudflare`的`SSL`的模式可以由`Flexible`改为`Full(strict)`了，即全程都是`https`传输。  

6、最后是把博文中的图片由`http`替换为`https`。重新部署后打开你的博客图片应该能正常展示了。  

另外对于博客部署在自己服务器上的，还要对服务器的`nginx`做配置以开启`https`，即`Cloudflare`到你服务器这段支持`https`：  

1、将刚申请的证书`pem`和私钥`key`保存为相应后缀的文件，并上传到服务器上：
![Github Page 添加自定义域名 + 开启 HTTPS + 支持七牛云图片](https://blog.luanzhuxian.com/blog/hexo-custom-domain/16.png)

2、修改`nginx`配置文件：
```
# 设定虚拟主机配置
server {

	listen   443 ssl http2;	# 侦听443端口，这个是ssl访问端口
    server_name  luanzhuxian.com;
	
	ssl    on;
	ssl_certificate    /etc/ssl/luanzhuxian.com.pem;
	ssl_certificate_key    /etc/ssl/luanzhuxian.com.key;

    ssl_session_cache	shared:SSL:1m;
    ssl_session_timeout	5m;
    ssl_protocols	TLSv1 TLSv1.1 TLSv1.2;	# 按照这个协议配置
    ssl_ciphers	ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;	# 按照这个套件配置
    ssl_prefer_server_ciphers	on;

	location / {
	   root   /home/www/;   # 博客项目存放的地址
	   index  index.html index.htm;	
    }

    # ......
}
```
之后重启`nginx`，尝试重新访问博客即可。  

