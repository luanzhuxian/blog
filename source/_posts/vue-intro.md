---
title: Vue 基本概念
comments: true
categories: vue
tags: vue
abbrlink: 44f8a53a
date: 2019-05-06 11:06:51
---

# data 为什么必须是函数？
要 return 一个新的 data 对象，否则修改其中一个会影响其他组件

# 组件通信
- 父子组件通信：$on、$emit、provide/inject
- 非父子组件的通信: event bus、
- vuex

# Vue SSR 基本原理
客户端 entry-client 主要作用挂载到 DOM 上，服务端 entry-server 除了创建和返回实例，还进行路由匹配与数据预获取。  
webpack 打包客户端为 client-bundle，打包服务端为 server-bundle。  
服务器接收请求，根据 url 来加载相应组件，然后生成 html 发送给客户端。  
客户端 Vue 在浏览器端接管由服务端发送的静态 html，使其变为由 Vue 管理的动态 DOM，为确保混合成功，客户端与服务器端需要共享同一套数据。在服务端，可以在渲染之前获取数据，填充到 stroe 里，这样，在客户端挂载到 DOM 之前，可以直接从 store 里取数据。首屏的动态数据通过 window.INITIAL_STATE 发送到客户端。

# 数据双向绑定原理
实现数据绑定的常见做法：
- `Object.defineProperty`：劫持各个属性的setter，getter
- 发布/订阅模式：通过消息发布并将消息进行订阅
- 脏值检测：通过特定事件进行轮循  

vue（vue 2.xx）采用的是`数据劫持`结合`发布者-订阅者模式`的方式，通过`Object.defineProperty`来实现对属性的劫持，并在数据变动时发布消息给订阅者，使其触发相应的监听回调。  

1、 实现 Observer  
将需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter。实现一个消息订阅器，维护一个数组，用来收集订阅者，数据变动触发 notify，再调用订阅者的 update 方法。  

2、 实现 Compiler  
compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。  

3、 实现 Watcher  
Watcher 订阅者是 Observer 和 Compiler 之间通信的桥梁。    
主要做的事情是：
- 在自身实例化时往属性订阅器 dep 里面添加自己
- 自身必须有一个 update 方法
- 待属性变动 dep.notice 通知时，能调用自身的 update 方法，并触发 Compiler 中绑定的回调  

4、 实现 MVVM  
MVVM 作为数据绑定的入口，整合 Observer、Compiler 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compiler 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compiler 之间的通信桥梁，达到`数据变化 -> 视图更新`；`视图交互变化(input) -> 数据model变更`的双向绑定效果  

# Vue 的 template 编译
template 会被编译成 AST 语法树，AST 会经过 generate 得到 render 函数，render 的返回值是 VNode，VNode 是 Vue 的虚拟 DOM 节点。  
- parse 过程，将 template 利用正则转化成 AST 抽象语法树
- optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能
- generate 过程，生成 render 字符串  

# Vue 为什么采用 Virtual DOM
一方面是出于性能方面的考量：
- 创建真实 DOM 的代价高：真实的 DOM 节点 node 实现的属性很多，而 vnode 仅仅实现一些必要的属性，相比起来，创建一个 vnode 的成本比较低。
- 触发多次浏览器重绘及回流：使用 vnode ，相当于加了一个缓冲，让一次数据变动所带来的所有 node 变化，先在 vnode 中进行修改，然后 diff 之后对所有产生差异的节点集中一次对 DOM tree 进行修改，以减少浏览器的重绘及回流  

但是性能受场景的影响是非常大的，不同的场景可能造成不同实现方案之间成倍的性能差距，所以依赖细粒度绑定及 Virtual DOM 哪个的性能更好不是一个容易下定论的问题。更重要的原因是为了解耦 HTML 依赖，这带来两个非常重要的好处是：
- 不再依赖 HTML 解析器进行模版解析，可以进行更多的 AOT 工作提高运行时效率：通过模版 AOT 编译，Vue 的运行时体积可以进一步压缩，运行时效率可以进一步提升；
- 可以渲染到 DOM 以外的平台，实现 SSR、同构渲染这些高级特性，Weex 等框架应用的就是这一特性。  

综上，Virtual DOM 在性能上的收益并不是最主要的，更重要的是它使得 Vue 具备了现代框架应有的高级特性。
