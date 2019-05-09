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

# 递归
## 数组扁平化
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

# 高阶函数
## 函数作为返回值输出
```
  function isType(type) {
    return function(obj) {
      return Object.prototype.toString.call(obj) === `[object ${type}]
    }
  }

  const isArray = isType('Array')
  const isString = isType('String')
  console.log(isArray([1, 2, [3,4]]) // true
  console.log(isString({})           // false
```
实现 bind
```
  Function.prototype.bind = function (context) {
    let self = this,
        args = Array.prototype.slice.call(arguments)

    return function () {
        return self.apply(context, args.slice(1));   
    }
  }
```

## Currying（柯里化）
柯里化是一个带有多个参数的函数并将其转换为函数序列的过程，每个函数只有一个参数。将一个低阶函数转换为高阶函数的过程。不会立即求值，而是继续返回一个新函数，将传入的参数通过闭包的形式保存，等到被真正求值的时候，再一次性把所有传入的参数进行求值。  
```
  f(a, b, c) => f(a)(b)(c)
                f(a, b)(c)
                f(a)(b, c)
```
一个有 n 个参数的函数，可以使用柯里化将它变成一个一元函数。
```
  const binaryFunction = (a, b) => a + b
  const curryUnaryFunction = a => b => a + b
  curryUnaryFunction(1) // returns a function: b => 1 + b
  curryUnaryFunction(1)(2) // returns the number 3
```
通用柯里化函数，用到了递归
```
  function curry (func) {
    // 函数的 length 属性能得到形参个数，而无法得知实参个数。
    var argsTotalLength = func.length
    return function curried() {
      var argsList = [].slice.call(arguments)
      if (argsList.length < argsTotalLength) {
        return function () {
          var argsNew = [].slice.call(arguments)
          return curried.apply(this, argsList.concat(argsNew)) // 将新旧的参数拼接起来
        }
      } else {
        return func.apply(this, argsList)
      }
    }
  }

  // ES6版
  function curry (func) {
    const argsTotalLength = func.length
    const curried = (...argsList) => argsList.length < argsTotalLength ?
      (...argsNew) => curried(...argsList, ...argsNew) :
      func(...argsList)
    return curried
  }

  var foo = function(a, b, c) {
    return console.log([a, b, c])
  }
  var curried = curry(foo)
  curried(1)(2)(3) // => [1, 2, 3]
  curried(1, 2)(3) // => [1, 2, 3]
  curried(1, 2, 3) // => [1, 2, 3]
```
这表明函数柯里化是一种预加载函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。从某种意义上来讲，这是一种对参数的缓存，是一种非常高效的编写函数的方法。  
柯里化函数非常适合提高代码的可重用性和函数式结构。想了解更多，请参考： JavaScript ES6 curry functions with practical examples。

## 闭包
### 防抖
当持续触发事件时，debounce 会合并事件且不会去触发事件，当一段时间内没有再次触发这个事件时，才真正去触发事件。  

非立即执行版
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/debounce_1.png)
非立即执行版是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
```
  function debounce(func, wait, ...args) {
    var timer
    return function () {
      var context = this
      // var args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
```

立即执行版
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/debounce_2.png)
立即执行版是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行。
```
  const debounce = (func, wait, ...args) => {
    let timer
    return function (){
      const context = this
      if (timer) cleatTimeout(timer)
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      },wait)

      if(callNow) func.apply(context,args)
    }
  }
```

结合版
```
  /**
  * @desc 函数防抖
  * @param func 函数
  * @param wait 延迟执行毫秒数
  * @param immediate true 表立即执行，false 表非立即执行
  */
  function debounce(func, wait, immediate) {
    var timer

    return function () {
      var context = this
      var args = arguments

      if (timer) clearTimeout(timer)
      if (immediate) {
        var callNow = !timer
        timer = setTimeout(function(){
          timer = null
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timer = setTimeout(function(){
          func.apply(context, args)
        }, wait)
      }
    }
  }
```

underscore 源码
```
  /**
   * underscore 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        回调函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
   * @return {function}             返回客户调用函数
   */
  _.debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result

      var later = function() {
        // 现在和上一次时间戳比较
        var last = _.now() - timestamp
        // 如果当前间隔时间少于设定时间且大于0就重新设置定时器
        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last)
        } else {
          // 否则的话就是时间到了执行回调函数
          timeout = null
          if (!immediate) {
            result = func.apply(context, args)
            if (!timeout) context = args = null
          }
        }
      }

      return function() {
        context = this
        args = arguments
        // 获得时间戳
        timestamp = _.now()
        // 如果定时器不存在且立即执行函数
        var callNow = immediate && !timeout
        // 如果定时器不存在就创建一个
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
          // 如果需要立即执行函数的话 通过 apply 执行
          result = func.apply(context, args)
          context = args = null
        }

        return result
      }
    }
```


### 节流
throttle（节流），当持续触发事件时，保证隔间时间触发一次事件。  
持续触发事件时，throttle 会合并一定时间内的事件，并在该时间结束时真正去触发一次事件。  

时间戳版
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/throttle_1.png)
在持续触发事件的过程中，函数会立即执行，并且每间隔时间执行一次。
```
  const throttle = (func, wait, ...args) => {
    let pre = 0
    return function(){
      const context = this
      let now = Date.now()
      if (now - pre >= wait){
         func.apply(context, args)
         pre = Date.now()
      }
    }
  }
```

定时器版
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/throttle_2.png)
函数不会立即执行，并且每间隔时间执行一次，在停止触发事件后，函数会执行一次。
```
  function throttle(func, wait, ...args) {
    var timer
    return function() {
      var context = this
      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
```

underscore 源码
```
  /**
  * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
  *
  * @param  {function}   func      回调函数
  * @param  {number}     wait      表示时间窗口的间隔
  * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
  *                                如果想忽略结尾函数的调用，传入{trailing: false}
  *                                两者不能共存，否则函数不能执行
  * @return {function}             返回客户调用函数   
  */
  _.throttle = function(func, wait, options) {
    var context, args, result
    var timeout = null
    // 之前的时间戳
    var previous = 0
    // 如果 options 没传则设为空对象
    if (!options) options = {}
    // 定时器回调函数
    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      // 用于下面函数的第一个 if 判断
      previous = options.leading === false ? 0 : _.now()
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    };
    return function() {
      // 获得当前时间戳
      var now = _.now()
      // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
      // 这样在接下来计算 remaining 的值时会大于0
      if (!previous && options.leading === false) previous = now
      // 计算剩余时间
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      // 如果当前调用已经大于上次调用时间 + wait
      // 或者用户手动调了时间
    // 如果设置了 trailing，只会进入这个条件
    // 如果没有设置 leading，那么第一次会进入这个条件
    // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
    // 其实还是会进入的，因为定时器的延时
    // 并不是准确的时间，很可能你设置了2秒
    // 但是他需要2.2秒才触发，这时候就会进入这个条件
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing
      // 没有的话就开启一个定时器
        // 并且不能不能同时设置 leading 和 trailing
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }
```


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
