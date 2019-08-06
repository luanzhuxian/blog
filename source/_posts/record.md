---
title: 记录
comments: true
abbrlink: e797f254
date: 2019-05-05 17:15:03
categories:
tags:
---

用户从输入url到最终页面展示，这个过程都发生了什么？  
计算机网络：http请求组包、网络模型、dns解析、建立连接
```
用户输入url，
浏览器缓存机制检查，
http请求包结构，
dns解析，
连接建立，
服务器端处理（如动态页面处理、静态页面处理、cdn相关知识），
浏览器收到html内容怎么解析，
怎么并行加载串行执行css、js，
怎么构造渲染树渲染页面，
怎么根据请求头把内容缓存到浏览器端，
https、同构直出、service worker...
```
# 函数单一职责
函数功能混乱，一个函数包含多个功能
```
  function sendEmailToClients(clients) {
    clients.forEach(client => {
      const clientRecord = database.lookup(client)
      if (clientRecord.isActive()) {
        email(client)
      }
    })
  }
```
功能拆解
```
  function sendEmailToActiveClients(clients) {
    clients.filter(isActiveClient).forEach(email)
  }

  function isActiveClient(client) {
    const clientRecord = database.lookup(client)
    retuen clientRecord.isActive()
  }
```

# 对象拷贝
- JSON.parse(JSON.stringify(obj)
- 递归
```
  function clone(value, isDeep) {
    if(value === null) return null
    if(typeof value !== 'object') return value
    if(Array.isArray(value)) {
      if(isDeep) {
        return value.map(item => clone(item, true))
      }
      return [].concat(value)
    } else {
      if (isDeep) {
        var obj = {}
        Object.keys(value).forEach(item => {
          obj[item] = clone(value[item], true)
        })
        return obj
      }
      return {...value}
    }
  }

  var objects = { c: { 'a': 1, e: [1, {f: 2}] }, d: { 'b': 2 } }
  var shallow = clone(objects, true)
  console.log(shallow.c.e[1]) // { f: 2 }
  console.log(shallow.c === objects.c) // false
  console.log(shallow.d === objects.d) // false
  console.log(shallow === objects) // false
```


# 数组
## 合并数组
1. Array.concat()：会创建一个新的数组，对于大数组来说会消耗大量内存。
2. Array.push.apply(arr1，arr2)

## 类数组 arguments 对象、DOM 节点列表转化成数组的几种方式
1. for 循环
2. Array.prototype.slice.call(NodeList)
3. Array.from(NodeList)
ES6 为了增加语义的清晰，语法的简洁性。添加了一个新方法 Array.from，用于将 arrayLike 的对象转换成数组。
4. 数组/对象扩展运算符 arr = [...NodeList]

# 是否可迭代
```
  if ((typeof arr[Symbol.iterator]).toUpperCase() === 'FUNCTION') {
    // do something
  }
```

# css 样式的优先级和使用时候的位置无关，只与声明的位置有关
```
  <div class="red blue">123</div>
  <div class="blue red">123</div>

  .red {
    color: red
  }

  .blue {
    color: blue
  }
```

# CommonJS、AMD、CMD、ES6 模块
CommonJS 同步加载。  
AMD 与 CMD 都是异步加载。区别：
- AMD 推崇依赖前置，在定义模块的时候就要声明其依赖的模块
- CMD 推崇就近依赖，只有在用到某个模块的时候再去 require  

ES6 在编译时就能确定模块的依赖关系，而 CommonJS 只能在运行时确定模块的依赖关系。
- 运行时加载：CommonJS 模块就是对象；先加载整个模块，然后直接生成对象，然后再从这个整体的对象上读取方法；
- 编译时加载：ES6 模块不是这样，采用的静态命令的形式。即在输入时可以指定加载摸个输出值的形式。而不是加载整个模块。  

所以 CommonJS 是先把整个模块加载完形成一个对象，在执行后面的操作，这意味着整个过程是一个同步事件，如果应用在服务器上，模块文件都存于本地硬盘加载比较快就不用考虑非同步加载的方式，所以 CommonJS 规范还是比较适用的。但是在客户端浏览器环境，要从服务器端获取资源，这时就可能必须要使用非同步模式，所以就有了 AMD 规范。  

# 0、1互换
```
  let a = 0
  a = ~a + 2
  console.log(a) // 1
```