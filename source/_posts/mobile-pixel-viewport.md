---
title: 移动端像素与Viewport
comments: true
categories: 移动端开发
tags: 移动端开发
abbrlink: fd25c770
date: 2021-01-03 21:04:48
---

# CSS像素、设备像素、设备独立像素

## CSS像素（CSS Pixel）
虚拟像素，`css`和`js`使用的抽象单位，是图像显示的基本单元，既不是一个确定的物理量，也不是一个点或者小方块，而是一个抽象概念。

## 设备像素（Device Pixel）
也称为物理像素，设备能控制显示的最小单位，显示屏是由一个个物理像素点组成的，通过控制每个像素点的颜色，使屏幕显示出不同的图像。

## 设备独立像素（Device Independent Pixel）
也称为逻辑像素，简称`DIP`。与设备无关的逻辑像素，代表可以通过程序控制使用的虚拟像素，是一个总体概念，包括了`css`像素。可以理解为：`CSS像素 = 设备独立像素 = 逻辑像素`。在`iOS`、`Android`和`React Native`开发中样式单位其实都使用的是设备独立像素。  
```
    页面的缩放系数 = CSS像素 / 设备独立像素
```

## DPR（device pixels ratio）
设备物理像素和设备独立像素的比例。计算公式：
```
    devicePixelRatio = 物理像素 / 设备独立像素
```
可以通过`window.devicePixelRatio`获得。所以通过`devicePixelRatio`，我们可以知道该设备上一个css像素占用多少个物理像素。例如iPhone6的`dpr`的值为2，也就是说1个css像素相当于2个物理像素，代表在该设备上，1个css像素是由2x2个设备像素绘制成的。iPhoneX的`dpr`的值为3，也就是说1个css像素相当于3个物理像素。如下图所示：
![DPR](/images/blog/mobile-compatiable/dpr.png)

## PPI（pixel per inch）
每英寸所包含的像素点数，更确切的说法应该是像素密度，也就是衡量单位物理面积内拥有像素值的情况。数值越高，说明屏幕能以更高密度显示图像，屏幕越清晰。 计算公式： 
![PPI](/images/blog/mobile-compatiable/ppi.png)
```
    比如iPhone 6，分辨率1920 * 1080，主对角线尺寸5.5
    斜边尺寸 = V(1920^2+1080^2) // V代表开根号 
    ppi = 斜边尺寸/5.5 
```
一般来说`dpr = ppi / 160`，`ppi`在120-160之间的手机被归为低密度手机，160-240被归为中密度，240-320被归为高密度，320以上被归为超高密度（例如苹果公司的`Retina`显示屏）。  


# 视口（Viewport）
视口代表当前可见的计算机图形区域。在`Web`浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的`UI`， 菜单栏等——即指你正在浏览的文档的那一部分。  

## viewport 的种类
一般我们把`viewport`分为三类：
### 布局视口（layout viewport）
浏览器默认的`viewport`，可以通过`document.documentElement.clientWidth`来获取。  
布局视口是网页布局的基准窗口，在`PC`浏览器上，布局视口就等于当前浏览器的窗口大小（不包括`borders`、`margins`、滚动条）。  
在移动端，宽度通常大于浏览器可视区域的宽度。因为如果把移动设备上浏览器的可视区域设为`viewport`的话，一些网站就会因为`viewport`太窄而显示错乱，所以浏览器厂商就决定把默认的`viewport`设为一个较宽的值，比如`980px`，这样的话即使是那些为桌面设计的网站也能在移动浏览器上正常显示了。  

### 视觉视口（visual viewport）
用户通过屏幕真实看到的区域，默认等于浏览器窗口的大小（包括滚动条宽度）。可以通过`window.innerWidth`来获取，宽度等于浏览器可视区域的宽度。当用户对浏览器进行缩放时，不会改变布局视口的大小，所以页面布局是不变的，但是缩放会改变视觉视口的大小。  
例如：用户将浏览器窗口放大了200%，这时浏览器窗口中的`CSS`像素会随着视觉视口的放大而放大，这时一个`CSS`像素会跨越更多的物理像素。  
所以，布局视口会限制你的`CSS`布局而视觉视口决定用户具体能看到什么。  

### 理想视口（ideal viewport）
移动设备的理想`viewport`，即网站页面在移动端展示的理想大小。可以通过调用`screen.width / height`来获取理想视口大小。没有一个固定的尺寸，不同的设备有不同`ideal viewport`。  
如下图，在浏览器调试移动端时页面上给定的像素大小就是理想视口大小，它的单位正是设备独立像素。  
![ideal viewport](/images/blog/mobile-compatiable/ideal-viewport.png)
上面在介绍`CSS`像素时曾经提到`页面的缩放系数 = CSS像素 / 设备独立像素`，实际说`页面的缩放系数 = 理想视口宽度 / 视觉视口宽度`更为准确。  
所以，当页面缩放比例为100%时，`ideal viewport`的宽度等于移动设备的屏幕宽度，`CSS像素 = 设备独立像素`，`理想视口 = 视觉视口`。  
`ideal viewport`的意义在于，无论在何种分辨率的屏幕下，那些针对`ideal viewport`而设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美的呈现给用户。

## 利用 meta 标签对 viewport 进行控制
移动设备默认的`viewport`是`layout viewport`，也就是那个比屏幕要宽的`viewport`，但在进行移动设备网站的开发时，我们需要的是`ideal viewport`。那么怎么才能得到`ideal viewport`呢？这就该轮到`meta`标签出场了。  
`meta`元素表示那些不能由其它`HTML`元相关元素之一表示的任何元数据信息，它可以告诉浏览器如何解析页面。我们可以借助`meta`元素的`viewport`来帮助我们设置视口、缩放等，从而让移动端得到更好的展示效果。  
我们在开发移动设备的网站时，最常见的的一个动作就是把下面这个东西复制到我们的`head`标签中：
```
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```
作用是让当前`viewport`的宽度等于设备的宽度，同时不允许用户手动缩放。如果你不这样的设定的话，那就会使用那个比屏幕宽的默认`layout viewport`，就会出现横向滚动条。  
上面是`viewport`配置的具体含义：

name | 可能值 | 描述
- | - | -
width  | 正整数或device-width | 以pixels（像素）为单位， 定义布局视口的宽度。
height  | 正整数或device-height | 以pixels（像素）为单位， 定义布局视口的高度。
initial-scale  | 0.0 - 10.0 | 定义页面初始缩放比率。
minimum-scale  | 0.0 - 10.0 | 定义缩放的最小值；必须小于或等于maximum-scale的值。
maximum-scale  | 0.0 - 10.0 | 定义缩放的最大值；必须大于或等于minimum-scale的值。
user-scalable  | 布尔值（yes或者no） | 如果设置为 no，用户将不能放大或缩小网页。默认值为 yes。
  
## 把当前的 viewport 宽度设置为 ideal viewport 的宽度
为了在移动端让页面获得更好的显示效果，我们必须让布局视口、视觉视口都尽可能等于理想视口。  
要得到`ideal viewport`就必须把默认的`layout viewport`的宽度设为移动设备的屏幕宽度。因为`meta viewport`中的`width`能控制`layout viewport`的宽度，`device-width`就等于理想视口的宽度，所以设置`width=device-width`就相当于让布局视口等于理想视口。
```
    <meta name="viewport" content="width=device-width">
    
    device-width = 设备的物理分辨率 / (devicePixelRatio * scale)
```

通过设置`initial-scale`可以达到同样的效果：
```
    <meta name="viewport" content="initial-scale=1">
```  
由于`initial-scale = 理想视口宽度 / 视觉视口宽度`，所以我们设置`initial-scale=1;`就相当于让视觉视口等于理想视口。
```
    当前缩放值 = ideal viewport宽度 / visual viewport宽度
```
缩放值越大，元素越大，当前`viewport`的宽度就会越小，视口能看到的东西越少，反之亦然。

最后，总结一下，要把当前的`viewport`宽度设为`ideal viewport`的宽度，既可以设置`width=device-width`，也可以设置`initial-scale=1`。但这两者各有一个小缺陷，就是iPhone、iPad以及IE会横竖屏不分，通通以竖屏的`ideal viewport`宽度为准。所以，最完美的写法应该是，两者都写上去，这样就`initial-scale=1`解决了iPhone、iPad的毛病，`width=device-width`则解决了IE的毛病。当两个设置冲突时，布局视口取两者最大值。   
这时，1个`CSS`像素就等于1个设备独立像素，而且我们也是基于理想视口来进行布局的，所以呈现出来的页面布局在各种设备上都能大致相似。  

# 获取浏览器窗口大小
- window.innerHeight：获取浏览器视觉视口高度（包括垂直滚动条）。
- window.outerHeight：获取浏览器窗口外部的高度。表示整个浏览器窗口的高度，包括侧边栏、窗口镶边和调正窗口大小的边框。
- window.screen.Height：获取获屏幕取理想视口高度，这个数值是固定的，设备的分辨率/设备像素比
- window.screen.availHeight：浏览器窗口可用的高度。
- document.documentElement.clientHeight：获取浏览器布局视口高度，包括内边距，但不包括垂直滚动条、边框和外边距。
- document.documentElement.offsetHeight：包括内边距、滚动条、边框和外边距。
- document.documentElement.scrollHeight：在不使用滚动条的情况下适合视口中的所有内容所需的最小宽度。测量方式与clientHeight相同：它包含元素的内边距，但不包括边框，外边距或垂直滚动条。