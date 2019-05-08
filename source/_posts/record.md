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

# 数组扁平化
用递归实现
```
  function flattenDepth(array, depth = 1) {
    let result = []
    array.forEach(item => {
      let d = depth
      if (Array.isArray(item) && d > 0) {
        result.push(...(flattenDepth(item, --d)))
      } else {
        result.push(item)
      }
    })
    return result
  }
  console.log(flattenDepth([1, [2, [3, [4]], 5]])) // [1, 2, [3, [4]], 5]
  console.log(flattenDepth([1, [2, [3, [4]], 5]], 2)) // [1, 2, 3, [4], 5]
  console.log(flattenDepth([1, [2, [3, [4]], 5]], 3)) // [1, 2, 3, 4, 5]
```
这里指定了 depth 作为扁平化的深度。  

# Currying（柯里化）
柯里化是一个带有多个参数的函数并将其转换为函数序列的过程，每个函数只有一个参数。将一个低阶函数转换为高阶函数的过程。  
```
  f(a, b, c) => f(a)(b)(c)
                f(a, b)(c)
                f(a)(b, c)
```
一个有n个参数的函数，可以使用柯里化将它变成一个一元函数。
```
  const binaryFunction = (a, b) => a + b
  const curryUnaryFunction = a => b => a + b
  curryUnaryFunction(1) // returns a function: b => 1 + b
  curryUnaryFunction(1)(2) // returns the number 3
```
柯里化，用到了递归
```
  function curry(func) {
    var l = func.length
    return function curried() {
      var args = [].slice.call(arguments)
      if(args.length < l) {
        return function() {
          var argsInner = [].slice.call(arguments)
          return curried.apply(this, args.concat(argsInner))
        }
      } else {
        return func.apply(this, args)
      }
    }
  }
  var f = function(a, b, c) {
    return console.log([a, b, c])
  }
  var curried = curry(f)
  curried(1)(2)(3) // => [1, 2, 3]
  curried(1, 2)(3) // => [1, 2, 3]
  curried(1, 2, 3) // => [1, 2, 3]
```
这表明函数柯里化是一种预加载函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。从某种意义上来讲，这是一种对参数的缓存，是一种非常高效的编写函数的方法。  
柯里化函数非常适合提高代码的可重用性和函数式结构。想了解更多，请参考： JavaScript ES6 curry functions with practical examples。

# pure functions（纯函数）
纯函数是一种其返回值仅由其参数决定，没有任何副作用的函数。
这意味着如果你在任何地方调用一个相同参数的纯函数一百次，该函数始终返回相同的值。纯函数不会更改或读取外部状态。
```
  let arr = []

  const impureAddNumber = number => arr.push(number)

  const pureAddNumber = number => anArray => anArray.concat([number])

  impureAddNumber(2) // returns 1

  arr // [2]

  pureAddNumber(3)(arr) // returns [2, 3]

  arr // [2]

  arr = pureAddNumber(3)(arr)

  arr // [2, 3]
```
concat 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。  
push 方法可向数组的末尾添加一个或多个元素，并返回新的长度。  
impureAddNumber 里 push 方法是不纯的，而且读取外部的 arr。

# 函数式编程
函数式编程（以下简称 FP）凭借其高复用性、易测试性和与之带来的健壮性和简洁开始逐渐占据前端技术圈，我们发现越来越多的前端框架以 FP 为设计核心准则。  
函数f的定义是：对于输入 x 产生一个唯一输出 y=f(x)。这便是纯函数。它符合两个条件：
- 此函数在相同的输入值时，总是产生相同的输出，函数的输出和当前运行环境的上下文状态无关。
- 此函数运行过程不影响运行环境，也就是无副作用（如触发事件、发起 http 请求等）。  

简单来说，也就是当一个函数的输出不受外部环境影响，同时也不影响外部环境时，该函数就是纯函数，也就是它只关注逻辑运算和数学运算，同一个输入总得到同一个输出。  
javascript 内置函数有不少纯函数如`map、slice`，也有不少非纯函数如`splice`。  
函数式编程的特征主要包括以下几个方面：
- 函数为一等公民
- 模块化、组合
- 引用透明
- 避免状态改变
- 避免共享状态  

JS 语言中的函数可以被当做参数和返回值进行传递，因此天生具备一等公民特性。模块化、组合、引用透明、避免状态改变、避免共享状态这四个特征都需要通过特定代码模式实现。  

## 分别实现数组所有元素相加、相乘、相与
非 FP 风格
```
  function plus(array) {
    var res = array[0]
    for (let i = 1; i < array.length; i++) {
      res += array[i]
    }
  }

  function mul(array) {
    var res = array[0]
    for (let i = 1; i < array.length; i++) {
      res *= array[i]
    }
  }

  function and (array) {
    var res = array[0]
    for (let i = 1; i < array.length; i++) {
      res = res & array[i]
    }
  }

  plus(array)
  mul(array)
  and(array)
```
FP 风格
```
  var array = [1, 2, 3]
  var ops = {
    "plus": (x,y) => x+y,
    "mul" : (x,y) => x*y,
    "and" : (x,y) => x&y
  }

  function operation(op, [head, ...tail]) {
    return tail.reduce(ops[op], head)
  }

  operation("plus", array)
  operation("mul",  array)
  operation("and",  array)
```

函数组合  
compose 会让函数从最后一个参数顺序执行到第一个参数，compose 的每个参数都是函数。
```
  var compose = function (f, g) {
    return function (x) {
      return f(g(x))
    }
  }

  // 或
  var compose = (f, g) => (x) => f(g(x))

  // 或
  var compose = (...args) => x => args.reduceRight((value, func) => func(value), x)

  var toUpperCase = (x) => x.toUpperCase()
  var exclaim = (x) => x + '!'
  var shout = compose(exclaim, toUpperCase)

  shout("send in the clowns") //=> "SEND IN THE CLOWNS!"
```
与组合函数相比，完整流程函数不可拆解，出厂的时候已经设计好了
```
  var shout = (x) => exclaim(toUpperCase(x))
```

组合函数实现反转数组：
```
  var head = x => x[0]
  var reverse = x => x.reduce((arr, x) => [x].concat(arr), [])
  var last = compose(head, reverse)
  last(['jumpkick', 'roundhouse', 'uppercut']) // => 'uppercut'
```
代码从右往左执行，非常清晰明了，一目了然。我们定义的 compose 像 N 面胶一样，可以将任意多个纯函数结合到一起。这种灵活的组合可以让我们像拼积木一样来组合函数式的代码。  

结合律：
```
  var associative = compose(f, compose(g, h)) == compose(compose(f, g), h)  // true

  compose(toUpperCase, compose(head, reverse))
  // 或
  compose(compose(toUpperCase, head), reverse)
```
结合律的好处是任何一个函数分组都可以被拆解开来，然后再以他们自己的组合打包在一起，组合成新的函数。  

下面用到了上面 compose 、head、reverse 函数：
```
  var loudLastUpper = compose(exclaim, toUpperCase, head, reverse)

  // 或
  var last = compose(head, reverse)
  var loudLastUpper = compose(exclaim, toUpperCase, last)

  // 或
  var last = compose(head, reverse)
  var angry = compose(exclaim, toUpperCase)
  var loudLastUpper = compose(angry, last)

  // 更多变种...
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


# 数组
## 合并数组
1. Array.concat()：会创建一个新的数组，对于大数组来说会消耗大量内存。
2. Array.push.apply(arr1，arr2)

## DOM 节点列表转化成数组的几种方式
1. for 循环
2. Array.prototype.slice.call(NodeList)
3. Array.from(NodeList)
ES6 为了增加语义的清晰，语法的简洁性。添加了一个新方法 Array.from，用于将 arrayLike 的对象转换成数组。
4. 数组/对象扩展运算符 arr = [...NodeList]

# 是否可迭代
```
  if ((typeof arr[Symbol.iterator]).toUpperCase() === 'FUNCTION') {

  }
```

# 闭包
## 防抖
不管你触发多少次，都等到你最后触发后过一段你指定的时间才触发。
```
  function debounce(func, wait) {
    var timer
    return function() {
      var context = this
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
```

## 节流
不管怎么触发，都是按照指定的间隔来执行。
```
  function throttle(func, wait) {
    var timer
    return function() {
      var context = this
      var args = arguments
      if (!timer) {
        timer = setTimeout(function () {
          timer = null
          func.apply(context, args)
        }, wait)
      }
    }
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
