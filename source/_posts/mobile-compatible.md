---
title: 移动端适配方案
comments: true
categories: 移动端开发
tags: 移动端开发
abbrlink: 783ce8a9
date: 2021-01-05 20:18:44
---

另一篇文章：[移动端像素与Viewport](https://www.luanzhuxian.com/post/fd25c770.html)  

# 移动端适配的问题

通常在PC端`1个设备独立像素 = 1个设备像素`，不用考虑兼容的问题。但在移动端，不同厂商不同型号的设备的`PPI`和`DPR`是不同的。所以同样的设计图在不同设备上展示效果是不尽相同的，分辨率越高，图像越缩小。假如设备的`DPR`为2，则设计图上的`1px`在设备上其实应该是4个像素点，则设计图的1像素实际是屏幕的2像素，如果不经过转化放大，那么设计图上的元素在设备上会被缩小1/2。所以我们要找到适用于各种设备的转换方法，使设计图在各个设备上看起来都一样。 

# 几个概念

下面几个都是`css`单位，就像`px`一样，只不过他们都是相对单位。  

## em
作为`font-size`的单位时，相对于父元素的字体大小单位；作为其他属性单位时，代表自身字体大小。

## rem
作用于非根元素时，相对于根元素的字体大小单位；作用于根元素字体大小时，相对于其初始字体大小。

## vm/vh
`vw`视口宽度的 1/100；`vh `视口高度的 1/100。


# rem 布局原理

根据屏幕宽度动态设置`html`标签的`font-size`。再将`px`替换为`rem`单位来布局，就可以达到适配的目的。  

## 网易的方案
如果设计稿的宽度是640px，根元素的`font-size`是100px相当于1rem，那么一个占满屏幕的元素的宽度就是6.4rem，6.4rem就是css样式该元素的宽度值。那如果现在要适配iPhone5，iPhone5的设备像素屏幕宽度为320px，如果想让6.4rem的元素以同样比例占满屏幕，则根元素的`font-size`是多少？
```
    6.4rem = 320px
    1rem = 320 / 6.4 = 50px
```
就是要把根元素的`font-size`设为50px。那如果现在要适配iPhone6？
```
    6.4rem = 375px
    1rem = 375 / 6.4 = 58.59375px
```
同理其他设备，只要通过`deviceWidth / 6.4`计算出根元素的`font-size`就可以了。  

1、首先通过`meta`标签设置视口：
```
    <meta name="viewport" content="initial-scale=1,maximum-scale=1, minimum-scale=1">
```

2、算出设计图相对100px的比例。因为假设设计稿根元素`font-size`是100，拿设计稿横向分辨率除以100得到body元素的宽度：
```
    750 / 100 = 7.5rem // 设计稿横向分辨率为750
    640 / 100 = 6.4rem // 设计稿横向分辨率为640
```

3、在`dom ready`后，动态设置根元素的`font-size`：
```
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px' // 设计稿横向分辨率为750
```
同理如果设计稿是640就除以6.4。  

4、在写`css`时转换为`rem`，设计稿上元素尺寸是多少，除以个100就行了，这也是为什么取100作为参照，就是为了写样式时转换`rem`方便。  
也就是：
```
    转换系数 = 设计图宽度 / 100
    根元素font-size = deviceWide(设备宽度) / 转换系数
    css元素尺寸 = 设计稿尺寸px / 100
```

## 淘宝的 flexible 方案  
`flexible`方案是阿里早期开源的一个移动端适配解决方案，引用`flexible`后，我们在页面上统一使用`rem`来布局。  
它的核心代码非常简单：
```
    // set 1rem = viewWidth / 10
    function setRemUnit () {
        var rem = document.documentElement.clientWidth / 10
        document.documentElement.style.fontSize = rem + 'px'
    }
    setRemUnit()
```
淘宝的做法是将`html`节点的`font-size`设置为页面`clientWidth`(布局视口)的1/10，即`1rem`就等于页面布局视口的1/10，这就意味着我们后面使用的`rem`都是按照页面比例来计算的。也就是`根元素 font-size = deviceWidth / 10`，如果是750的设计稿，根元素的`font-size`是75px，那么设计稿上一个宽度375px的`div`就是5rem，占设计稿的50%。若要适配宽度为375的设备，根元素的`font-size`是37.5px，5rem就是187.5px，仍然占设备宽的50%。   

1、动态设置`viewport`的`scale`，控制页面的渲染比例：
```
    var scale = 1 / devicePixelRatio
    document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
```
虽然设备宽度是一定的，但是希望展示设计稿的宽度。比如750px的设计稿需要适配375px、dpr为2的iPhone6，就需要通过`scale = 1 / 2`改变视口宽度为`375px * dpr = 750px`。相当于原来375px的元素现在能代表750px的元素。相当于我们把750px的页面放到了750px的设备(通过改变`scale`值模拟出来的视口)中打开，然后透过375px的设备(当前打开页面的设备)去观看(注意：这里是观看，不是渲染。) 页面。  

2、动态设置根元素的`font-size`：
```
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px'
```

3、在写`css`时转换为`rem`：
```
    各元素的css尺寸 = 设计稿标注尺寸 / 根元素font-size = 设计稿标注尺寸 / 设计稿横向分辨率 / 10
```
也就是：
```
    html = vp(视口宽度) / 10 = deviceWide(设备宽度) * dpr / 10
    css元素尺寸 = 设计稿尺寸px / 根元素font-size
```

## 对比网易淘宝的方案
- 网易是以`100px`作为参照，任何设计图上元素的尺寸转为`rem`都是相对于`100px`做转换的。不同设备的根元素的`font-size`都需要根据设计图的尺寸做比例转换。转换后我们写的以`rem`为单位的样式就能还原出设计图的样子。  
- 淘宝的做法就是任何设备宽都是`10rem`，根元素的`font-size`都是`设备宽 / 10`，任何元素的尺寸转为`rem`后其实是保留了相对于设备宽的比例，这个比例拿到其他设备上就能还原出设计图的样子。  
- 网易不用管`dpr`，只需知道设计稿宽度。  
- 网易的做法，`rem`值很好计算，淘宝的做法肯定得用计算器才能用好了 。不过要是你使用了`less`和`sass`这样的`css`处理器，就好办多了。 
```
    less

    // 定义一个变量和一个 mixin
    @baseFontSize: 75;  // 基于视觉稿横屏尺寸 / 100 得出的基准font-size
    .px2rem (@name, @px) {
        @{name}: @px / @baseFontSize * 1rem;
    }

    // 使用示例：
    .container {
        .px2rem(width, 320);
    }
    // 编译后：
    .container {
        width: 4.26rem;
    }


    sass

    @function px2rem ($px) {
        $baseFontSize: 75px;
        @return ($px / $baseFontSize) + rem;
    }
    .container {
        width: px2rem(320px);
    }
```


# vw、vh 方案
由于`viewport`单位得到众多浏览器的兼容，上面方案现在已经被官方弃用。现在最流行的是`vw`、`vh`方案。 

## vw、vh
`vw`、`vh`方案即将视觉视口宽度`window.innerWidth`和视觉视口高度`window.innerHeight` 等分为100份。  
上面的`flexible`方案就是模仿这种方案，因为早些时候`vw`还没有得到很好的兼容。  
- vw(Viewport's width)：`1vw`等于视觉视口的1%。
- vh(Viewport's height)：`1vh`为视觉视口高度的1%。
- vmin：`vw`和`vh`中的较小值。
- vmax：选取`vw`和`vh`中的较大值。

如果视觉视口为`375px`，那么`1vw = 3.75px`，这时`UI`给定一个元素的宽为`75px`（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`。该元素在设计图上的是`20个vw`占屏幕`20%`，则在任何其他设备上`20vw`也同样占屏幕`20%`，达到适配的效果。  
这里的比例关系我们也不用自己换算，我们可以使用`PostCSS`的`postcss-px-to-viewport`插件帮我们完成这个过程。只需要在配置时指定设计图宽度就可以了，写代码时，我们只需要根据`UI`给的设计图写`px`单位即可。  
当然，没有一种方案是十全十美的，`vw`同样有一定的缺陷：
- `px`转换成`vw`不一定能完全整除，因此有一定的像素差。
- 当容器使用`vw`，`margin`采用`px`时，很容易造成整体宽度超过`100vw`，从而影响布局效果。当然我们也是可以避免的，例如使用`padding`代替`margin`，结合`calc()`函数使用等等...

## postcss-px-to-viewport
首先安装`postcss-px-to-viewport`插件。该插件主要用来把`px`单位自动转换为`vw`、`vh`、`vmin`、`vmax`这样的`viewport`视窗单位，也是`vw`适配方案的核心插件之一。  

可以在`.postcssrc.js`文件中对`postcss`插件进行配置：  
```
    module.exports = {
        ‘plugins‘: {
            ‘postcss-px-to-viewport‘: {
                viewportWidth: 750,
                unitPrecision: 6,
                minPixelValue: 1,
                viewportUnit: 'vw',
                mediaQuery: true,
                selectorBlackList: ['html', 'body'],
                exclude: /node_modules/
            }
        }
    }
```
如果用的是`vue-cli`的话，也可以在`vue.config.js`文件中进行配置：  
```
    module.exports = {
        css: {
            loaderOptions: {
                postcss: {
                    plugins: loader => [
                        require('postcss-px-to-viewport')({
                            viewportWidth: 750,
                            unitPrecision: 6,
                            minPixelValue: 1,
                            viewportUnit: 'vw',
                            mediaQuery: true,
                            selectorBlackList: ['html', 'body'],
                            exclude: /node_modules/
                        })
                    ]
                }
            }
        }
    }
```
其中相关的几个关键参数：
- viewportWidth：The width of the viewport. 视窗的宽度，对应的是我们设计稿的宽度，一般是750。
- viewportHeight：The height of the viewport. 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置。
- unitPrecision：The decimal numbers to allow the REM - units to grow to. 指定`px`转换为视窗单位值的小数位数。
- viewportUnit：Expected units. 指定需要转换成的视窗单位，建议使用`vw`。
- selectorBlackList：The selectors to - ignore and leave as px. 指定不转换为视窗单位的选择器（如标签、类），可以自定义，可以无限添加，建议定义一至两个通用的类名。
- minPixelValue：Set the minimum pixel value to replace. 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值。
- mediaQuery：Allow px to be converted in media - queries. 允许在媒体查询中转换`px`。

我们使用`750px`宽度的设计稿，那么`100vw = 750px`，即`1vw = 7.5px`。那么在实际撸码过程，不需要进行任何的计算，直接按照设计图中的标注写`px`的值就行，打包后会转换成对应的`vw`值，因为`vw`可以代表比例，所以可以适配各种不同的设备。  


# 1像素问题

为了适配各种屏幕，我们写代码时一般使用设备独立像素来对页面进行布局。而在设备像素比大于1的屏幕上，我们写的`1px`实际上是被多个物理像素渲染，这就会出现`1px`在有些屏幕上看起来很粗的现象。  

## border-image
准备一张符合条件的边框背景图作为`border-image`。
```
    .border_1px {
        border-bottom: 1px solid #000;
    }
    // 媒体查询，当设备的dpr是2的时候，用border-image覆盖上面的border样式
    @media only screen and (-webkit-min-device-pixel-ratio:2) {
        .border_1px {
            border-bottom: none;
            border-width: 0 0 1px 0;
            border-image: url(1pxline.png) 0 0 2 0 stretch;
        }
    }
```

## background-image
和`border-image`类似，用边框背景图，模拟在背景上。
```
    .border_1px {
        border-bottom: 1px solid #000;
    }
    @media only screen and (-webkit-min-device-pixel-ratio:2) {
        .border_1px {
            background: url(1pxline.png) repeat-x left bottom;
            background-size: 100% 1px;
        }
    }
```
上面两种都需要单独准备图片，而且圆角不是很好处理，但是可以应对大部分场景。

## 伪类 + transform
基于媒体查询，判断不同的设备像素比对线条进行缩放：
```
    .border_1px:before {
        content: '';
        position: absolute;
        top: 0;
        height: 1px;
        width: 100%;
        background-color: #000;
        transform-origin: 50% 0%;
    }
    @media only screen and (-webkit-min-device-pixel-ratio:2) {
        .border_1px:before {
            transform: scaleY(0.5);
        }
    }
    @media only screen and (-webkit-min-device-pixel-ratio:3) {
        .border_1px:before {
            transform: scaleY(0.33);
        }
    }
```

## postcss-write-svg
上面`border-image`和`background-image`方案都可以模拟`1px`边框，但是使用的都是位图，还需要外部引入。  
借助`PostCSS`的`postcss-write-svg`我们能直接使用`border-image`和`background-image`创建`svg`的`1px`边框。 
比如使用`border-image`：
```
    @svg 1px-border {
        height: 2px;
        @rect {
            fill: var(--color, black);
            width: 100%;
            height: 50%;
        }
    }
    .example {
        border: 1px solid transparent;
        border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
    }
```
编译出来的css：
```
    .example {
        border: 1px solid transparent;
        border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch;
    }
```
使用`background-image`：
```
    @svg square {
        @rect {
            fill: var(--color, black);
            width: 100%;
            height: 100%;
        }
    }
    #example {
        background: white svg(square param(--color #00b1ff));
    }
```
编译出来就是：
```
    #example {
        background: white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2300b1ff' width='100%25' height='100%25'/%3E%3C/svg%3E");
    }
```

## 设置viewport
通过设置缩放，让`CSS`像素等于真正的物理像素。例如：当`dpr`为3时，缩放前`1px`是由`3x3`个物理像素绘制的，我们将页面缩放`1/3`倍后，这时`1px`等于一个真正的物理像素。
```
    var scale = 1 / window.devicePixelRatio
    var viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
        viewport = document.createElement('meta')
        viewport.setAttribute('name', 'viewport')
        window.document.head.appendChild(viewport)
    }
    viewport.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale)
```
或动态插入：
```
    var scale = 1 / window.devicePixelRatio
    var meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no'
    document.head.appendChild(meta)
```
这意味着你页面上所有的布局都要按照物理像素来写。而不同设备物理像素不一样，这显然是不现实的，我们可以借助`flexible`或`vw`、`vh`来帮助我们进行适配。  


# 横屏适配
很多视口我们要对横屏和竖屏显示不同的布局，所以我们需要检测在不同的场景下给定不同的样式。

## JavaScript 检测横屏
`window.orientation`获取屏幕旋转方向。
```
    window.addEventListener('resize', () => {
        if (window.orientation === 180 || window.orientation === 0) { 
            // 正常方向或屏幕旋转180度
            console.log('竖屏')
        }
        if (window.orientation === 90 || window.orientation === -90 ){ 
            // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
            console.log('横屏')
        }  
    })
```

## CSS 检测横屏
```
    @media screen and (orientation: portrait) {
        /*竖屏...*/
    } 
    @media screen and (orientation: landscape) {
        /*横屏...*/
    }
```

# 适配 iPhoneX
适配`iPhoneX`，有了安全区域这个概念：安全区域就是一个不属于上面三个`viewport`范围。为了保证页面的显示效果，我们必须把页面限制在安全范围内，但是不影响整体效果。  

## viewport-fit
`viewport-fit`是专门为了适配`iPhoneX`而诞生的一个属性，它用于限制网页如何在安全区域内进行展示。  
- contain: 可视窗口完全包含网页内容
- cover：网页内容完全覆盖可视窗口

默认情况下或者设置为`auto`和`contain`效果相同。  

## env、constant
我们需要将顶部和底部合理的摆放在安全区域内，`iOS11`新增了两个`CSS`函数`env`、`constant`，用于设定安全区域与边界的距离。  
函数内部可以是四个常量：
- safe-area-inset-left：安全区域距离左边边界距离；
- safe-area-inset-right：安全区域距离右边边界距离；
- safe-area-inset-top：安全区域距离顶部边界距离；
- safe-area-inset-bottom：安全区域距离底部边界距离；

注意：我们必须指定`viweport-fit`后才能使用这两个函数：
```
    <meta name="viewport" content="viewport-fit=cover">
```
`constant`在`iOS < 11.2`的版本中生效，`env`在`iOS >= 11.2`的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内：
```
    body {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
```
当使用底部固定导航栏时，我们要为他们设置`padding`值：
```
    {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
```