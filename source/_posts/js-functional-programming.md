---
title: 函数式编程
comments: true
categories: javascript
tags: javascript
abbrlink: 1690d21b
date: 2019-05-10 09:39:41
---

主要的编程范式有三种：命令式编程（Imperative programming）、面向对象编程（Object Oriented Programming）和函数式编程（Functional Programming）。  

假设我们有这么个需求，我们登记了一系列人名存在数组中，现在需要对这个结构进行一些修改，需要把字符串数组变成一个对象数组，方便后续的扩展，并且需要把人名做一些转换： 
```
  ['john-reese', 'harold-finch', 'sameen-shaw'] 
  // 转换成
  [{name: 'John Reese'}, {name: 'Harold Finch'}, {name: 'Sameen Shaw'}]
```

# 命令式编程
用传统的编程思路，乎是所有人下意识的编程思路，完全的面向过程。会需要依次完成：
- 定义一个临时变量 newArr。
- 我需要做一个循环。
- 循环需要做 arr.length 次。
- 每次把名字的首位取出来大写，然后拼接剩下的部分。
- ……
- 最后返回结果。  

```
  const arr = ['john-reese', 'harold-finch', 'sameen-shaw']
  const newArr = []
  for (let i = 0, len = arr.length; i < len ; i++) {
    let name = arr[i]
    let names = name.split('-')
    let newName = []
    for (let j = 0, naemLen = names.length; j < naemLen; j++) {
      let nameItem = names[j][0].toUpperCase() + names[j].slice(1)
      newName.push(nameItem)
    }
    newArr.push({ name : newName.join(' ') })
  }
  return newArr
```

# 函数式编程
函数式编程（以下简称 FP）是一种编程风格，就是将函数作为参数传递或作为返回值，但没有函数副作用（函数副作用即会改变程序的状态）。  
凭借其高复用性、易测试性和与之带来的健壮性和简洁开始逐渐占据前端技术圈，我们发现越来越多的前端框架以 FP 为设计核心准则。  

我们来看一看函数式编程会如何思考这个问题。  
我只需要一个函数能实现从 String 数组 到 Object 数组 的转换：

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_1.png)
```
  convertNames :: [String] -> [Object]
```
这里面涉及到一个 String -> Object 的转换，那我需要有这么个函数实现这种转换：

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_2.png)
```
  convert2Obj :: [String] -> [Object]
```
至于这种转换，可以轻松想到需要两个函数完成：capitalizeName：把名称转换成指定形式，genObj：把任意类型转换成对象  

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_3.png)
如果再细想一下，capitalizeName 其实也是几个方法的组合（split, join, capitalize），剩下的几个函数都是非常容易实现的。

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_4.png)
代码实现：
```
  const capitalize = x => x[0].toUpperCase() + x.slice(1).toLowerCase()
  const genObj = curry((key, x) => {
    let obj = {}
    obj[key] = x
    return obj
  }) 
  const capitalizeName = compose(join(' '), map(capitalize), split('-'))
  const convert2Obj = compose(genObj('name'), capitalizeName)
  const convertName = map(convert2Obj)

  convertName(['john-reese', 'harold-finch', 'sameen-shaw'])
```

# 函数式编程的特征：
## 函数为一等公民(First-Class Functions)
函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。

## 声明式编程 (Declarative Programming)
函数式编程大多时候都是在声明我需要做什么，而非怎么去做。这种编程风格称为 声明式编程 。这样有个好处是代码的可读性特别高，因为声明式代码大多都是接近自然语言的，同时，它解放了大量的人力，因为它不关心具体的实现，因此它可以把优化能力交给具体的实现，这也方便我们进行分工协作。

## 惰性执行（Lazy Evaluation）
即不产生无意义的中间变量。

## 引用透明
## 避免共享状态  

## 无状态和数据不可变 (Statelessness and Immutable data)
  - 无状态：对于一个函数，输入和输出是一一对应的关系，给定相同的输入，会得到相同的输出，完全不依赖外部状态的变化。  
  - 数据不可变：所有的数据都是不可变的，如果你想修改一个对象，那你应该创建一个新的对象用来修改，而不是修改已有的对象。(不修改全局变量，不修改入参)  
为了实现这个目标，函数式编程提出函数应该具备的特性：没有副作用和纯函数。
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_5.png)

## 没有副作用（No Side Effects）
在函数中我们最常见的副作用就是随意操纵外部变量。  
例如：在 JS 中，我们经常可以看到下面这种对 map 的 “错误” 用法，把 map 当作一个循环语句，然后去直接修改数组中的值。
```
  const list = [...]
  // 修改 list 中的 type 和 age
  list.map(item => {
    item.type = 1
    item.age++
  })
```
这样函数最主要的输出功能没有了，变成了直接修改了外部变量，这就是它的副作用。而没有副作用的写法应该是：
```
  const list = [...]
  // 修改 list 中的 type 和 age
  const newList = list.map(item => ({...item, type: 1, age:item.age + 1}))
```

# 纯函数（Pure Functions）
函数式编程，本质上是数学，它是数学现有理论在编程上的实现。一个数学定理成立通常要满足一些条件，函数式编程也需要满足条件，这个条件就是函数必须是纯函数。  

纯函数是一种其返回值仅由其参数决定，没有任何副作用的函数。
对于输入 x 产生一个唯一输出 y=f(x)。这便是纯函数。它符合两个条件：
- 不依赖外部状态（无状态）：此函数在相同的输入值时，总是产生相同的输出，函数的输出和当前运行环境的上下文状态无关，不依赖全局变量，this 指针，IO 操作等。
- 没有副作用（数据不可变）：此函数运行过程不影响运行环境，也就是无副作用（不修改全局变量、不修改入参、触发事件、发起 http 请求等）。  

简单来说，也就是当一个函数不会更改或读取外部状态，输出不受外部环境影响，同时也不影响外部环境时，该函数就是纯函数，也就是它只关注逻辑运算和数学运算，同一个输入总得到同一个输出。  
javascript 内置函数有不少纯函数如`map、slice、concat`，也有不少非纯函数如`splice、push`。
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
`impureAddNumber`里`push`方法是不纯的，而且读取外部的`arr`。  

以下几个函数都是不纯的，因为他们都依赖外部变量，试想一下，`saySth`修改了外部变量，`changeName`修改了入参。
```
  const curUser = {
    name: 'Peter'
  }

  const saySth = str => curUser.name + ': ' + str // 引用了全局变量
  const changeName = (obj, name) => obj.name = name  // 修改了输入参数
  changeName(curUser, 'Jay')  // { name: 'Jay' }
  saySth('hello!')  // Jay: hello!
```
改成纯函数
```
  const curUser = {
    name: 'Peter'
  }

  const saySth = (user, str) => user.name + ': ' + str   // 不依赖外部变量
  const changeName = (user, name) => ({...user, name })  // 未修改外部变量

  const newUser = changeName(curUser, 'Jay')  // { name: 'Jay' }
  saySth(curUser, 'hello!')  // Peter: hello!
```
纯函数的意义
- 便于测试和优化
- 自文档化
- 更少的 Bug
- 可缓存性
```
  function memoize(fn) {  
    const cache = {}
    return function() {
      const key = JSON.stringify(arguments) 
      let value = cache[key]     
      if (!value) {
        value = [fn.apply(null, arguments)]  // 放在一个数组中，方便应对 undefined，null 等异常情况
        cache[key] = value
      }     
      return value[0]
    }
  }
  
  const fibonacci = memoize(n => n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2))
  console.log(fibonacci(4))  // 执行后缓存了 fibonacci(2), fibonacci(3),  fibonacci(4)
  console.log(fibonacci(10)) // fibonacci(2), fibonacci(3),  fibonacci(4) 的结果直接从缓存中取出，同时缓存其他的
```

# 函数式编程例子

## 分别实现数组所有元素相加、相乘、相与
非 FP 风格
```
  function plus (array) {
    var res = array[0]
    for (let i = 1; i < array.length; i++) {
      res += array[i]
    }
  }

  function mul (array) {
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
    "plus": (x, y) => x + y,
    "mul" : (x, y) => x * y,
    "and" : (x, y) => x & y
  }

  function operation(op, [head, ...tail]) {
    return tail.reduce(ops[op], head)
  }

  operation("plus", array)
  operation("mul",  array)
  operation("and",  array)
```

函数式编程凭借其传递和返回函数的能力，带来了许多概念：
- 柯里化
- 高阶函数  

## 柯里化（Currying）
如果说函数式编程中有两种操作是必不可少的那无疑就是柯里化（Currying）和函数组合（Compose），柯里化其实就是流水线上的加工站，函数组合就是我们的流水线，它由多个加工站组成。现在很好理解为什么柯里化配合函数组合有奇效了，在流水线上的加工站必须都是单元函数，柯里化处理的结果刚好就是单输入的。  

柯里化是函数式编程中的一种过程，将一个低阶函数转换为高阶函数的过程。  
可以将接受具有多个参数的函数转化为一个的嵌套函数队列，然后返回一个新的函数以及期望下一个的内联参数。它不断返回一个新函数直到所有参数都用完为止。这些参数会通过闭包的形式保存，不会被销毁。当柯里化链中最后的函数返回并执行时，再一次性把所有传入的参数进行求值。柯里化函数的嵌套函数的数量取决于它接受的参数。  
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

### 函数柯里化有用吗？
柯里化函数非常适合提高代码的可重用性和函数式结构。  

#### 1、编写轻松重用和配置的小代码块，就像我们使用 npm 一样：  
举个例子，比如你想给顾客给个10%的折扣：
```
  function discount(price, discount) {
    return price * discount
  }
```
你可以预见，从长远来看，会发现自己每天都在重复计算 10% 的折扣：
```
  const price = discount(1500, 0.10) // $150
  const price = discount(2000, 0.10) // $200
  const price = discount(50, 0.10) // $5
  const price = discount(5000, 0.10) // $500
  const price = discount(300, 0.10) // $30
```
我们可以将 discount 函数柯里化，这样我们就不用总是每次增加这 0.01 的折扣。并且可以给客户提供 20% 的折扣。
```
  function discount(discount) {
    return (price) => {
        return price * discount
    }
  }
  const tenPercentDiscount = discount(0.1)
  const twentyPercentDiscount = discount(0.2)

  twentyPercentDiscount(500) // 100
  twentyPercentDiscount(5000) // 1000
  twentyPercentDiscount(1000000) // 200000
```
#### 2、避免频繁调用具有相同参数的函数
举个例子，我们有一个计算圆柱体积的函数
```
  function volume(l, w, h) {
    return l * w * h
  }
```
碰巧仓库所有的气缸高度为 100 米，你将会看到你将重复调用此函数，h 为 100 米
```
  volume(200, 30, 100) // 2003000
  volume(32, 45, 100) //144000
  volume(2322, 232, 100) // 53870400
```
要解决以上问题，你可以将 volume 函数柯里化：
```
  function volume(h) {
    return (w) => {
        return (l) => {
            return l * w * h
        }
    }
  }
```
我们可以定义一个专门指定圆柱体高度的的函数：
```
  const hCylinderHeight = volume(100)
  hCylinderHeight(200)(30) // 600, 000
  hCylinderHeight(2322)(232) // 53, 870, 400
```

### add 柯里化  
```
  function add () {
    //args，利用闭包特性，不断保存arguments
    var args = [].slice.call(arguments)
    var _add = function () {
      if (arguments.length === 0) {
        //参数为空，对args执行加法
        return args.reduce((a, b) => a + b)
      } else {
        //否则，保存参数到args，返回一个函数
        Array.prototype.push.apply(args, arguments)
        return _add
      }
    }
    return _add
  }
  console.log(add(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)()) // 42
```
可以看出来，柯里化其实是有特点的，需要一个闭包保存参数，一个函数来进行递归。这种模式是可以通过一个包装函数，它接受任何函数并返回一个柯里化版本的函数。  

### 通用柯里化函数
版本一：
```
  function curry (fn, ...args) {
    return (..._arg) => {
        return fn(...args, ..._arg)
    }
  }

  function volume (l, h, w) {
    return l * h * w
  }
  const hCy = curry(volume, 100)
  hCy(200, 900) // 18000000
  hCy(70, 60) // 420000
```
版本二：
```
  function curry (func) {
    // args保存参数，注意，第一个参数应该是要柯里化的函数，所以args里面去掉第一个
    var args = [].slice.call(arguments, 1)
    var _func = function () {
      //参数长度为0，执行func函数，完成该函数的功能
      if (arguments.length === 0) {
        return func.apply(this, args)
      } else {
        //否则，存储参数到闭包中，返回本函数
        Array.prototype.push.apply(args, arguments)
        return _func
      }
    }
    return _func
  }

  function add () {
    return Array.prototype.reduce.call(arguments, (a, b) => a + b)
  }
  console.log(curry(add, 1, 2, 3)(1)(2)(3, 4, 5, 5)(5, 6, 6, 7, 8, 8)(1)(1)(1)()) // 69
```
版本三：
```
  function curry (func) {
    // 函数的 length 属性能得到形参个数，而无法得知实参个数。
    var argsTotalLength = func.length
    return function curried () {
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

  var foo = function (a, b, c) {
    return console.log([a, b, c])
  }
  var curried = curry(foo)
  curried(1)(2)(3) // => [1, 2, 3]
  curried(1, 2)(3) // => [1, 2, 3]
  curried(1, 2, 3) // => [1, 2, 3]
```
这表明函数柯里化是一种预加载函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。从某种意义上来讲，这是一种对参数的缓存，是一种非常高效的编写函数的方法。  

## 函数组合
函数组合的目的是将多个函数组合成一个函数。compose 会让函数从最后一个参数顺序执行到第一个参数，compose 的每个参数都是函数。  
简单实现和用法如下：
```
  const compose = (...fns) => (...args) => fns.reduceRight((val, fn) => fn.apply(null, [].concat(val)), args)
  const f = x => x + 1
  const g = x => x * 2
  const t = (x, y) => x + y

  let fgt = compose(f, g, t)
  fgt(1, 2)// 3 -> 6 -> 7
```
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
compose 其实是满足结合律的
```
  compose(f, compose(g, t)) = compose(compose(f, g), t)  = f(g(t(x)))
```
只要其顺序一致，最后的结果是一致的，因此，我们可以写个更高级的 compose，支持多个函数组合：
```
  compose(f, g, t) => x => f(g(t(x))
```
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
考虑一个小功能：将数组最后一个元素大写，假设 log, head，reverse，toUpperCase 函数存在（我们通过 curry 可以很容易写出来）  
命令式的写法：
```
  log(toUpperCase(head(reverse(arr))))
```
面向对象的写法：
```
  arr.reverse()
    .head()
    .toUpperCase()
    .log()
```
链式调用看起来顺眼多了，然而问题在于，原型链上可供我们链式调用的函数是有限的，而需求是无限的 ，这限制了我们的逻辑表现力。  
再看看，现在通过组合，我们如何实现之前的功能：
```
  const upperLastItem = compose(log, toUpperCase, head, reverse)
```
通过参数我们可以很清晰的看出发生了 uppderLastItem 做了什么，它完成了一套流水线，所有经过这条流水线的参数都会经历：reverse -> head -> toUpperCase -> log 这些函数的加工，最后生成结果。  
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/functional-programming_6.png)
最完美的是，这些函数都是非常简单的纯函数，你可以随意组合，随意拿去用，不用有任何的顾忌。

## 高阶函数（Higher-Order Functions）
### 函数作为返回值输出
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

## 递归
### 数组扁平化
```
  function flattenDepth (array, depth = 1) {
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

## 闭包
虽然函数早已返回而且已经在内存中执行垃圾回收。但是它的变量还是以某种方式保持存活。
### 保存当前 this 的引用
```
  class Bar {
    constructor (name) {
      this.name = name
    }
    getName () {
      let that = this
      setTimeout(function() {
          console.log(that.name)
      }, 1000)
    }
  }

  conts bar = new Bar('bar')
  bar.getName() //  'bar'
```

### 防抖
当持续触发事件时，debounce 会合并事件且不会去触发事件，当一段时间内没有再次触发这个事件时，才真正去触发事件。  

非立即执行版
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/debounce_1.png)
非立即执行版是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
```
  function debounce(func, wait) {
    var timer
    return function () {
      const context = this
      const args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
```

立即执行版
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/debounce_2.png)
立即执行版是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行。
```
  const debounce = (func, wait) => {
    let timer
    return function (){
      const context = this
      const args = arguments
      if (timer) cleatTimeout(timer)
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      },wait)

      if(callNow) func.apply(context, args)
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
      const context = this
      const args = arguments

      if (timer) clearTimeout(timer)
      if (immediate) {
        const callNow = !timer
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
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/throttle_1.png)
在持续触发事件的过程中，函数会立即执行，并且每间隔时间执行一次。
```
  const throttle = (func, wait) => {
    let pre = 0
    return function(){
      const context = this
      const args = arguments
      let now = Date.now()
      if (now - pre >= wait){
         pre = Date.now()
         func.apply(context, args)
      }
    }
  }
```

定时器版
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/throttle_2.png)
函数不会立即执行，并且每间隔时间执行一次，在停止触发事件后，函数会执行一次。
```
  function throttle(func, wait) {
    var timer
    return function() {
      const context = this
      const args = arguments
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

### 节流搭配防抖
间隔时间内，可以重新生成定时器；但只要delay的时间到了，必须要给用户一个响应。避免防抖事件无休止触发导致无法响应。
```
  const throttle = (func, wait) => {
    let pre = 0
    let timer = null
    return function(){
      const context = this
      const args = arguments
      let now = Date.now()
      // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
      if (now - pre < wait){
        // 如果小于阈值，则设立一个新的定时器
        clearTimeout(timer)
        timer = setTimeout(() => {
            pre = Date.now()
            func.apply(context, args)
        }, wait)
      } else {
        // 否则，就不等了，无论如何要反馈给用户一次响应
        pre = Date.now()
        func.apply(context, args)
      }
    }
  }

  document.addEventListener('scroll', throttle(() => do something, 1000))
```


# 总结
可以在日常工作中将函数式编程作为一种辅助手段，在条件允许的前提下，借鉴函数式编程中的思路，例如：
- 多使用纯函数减少副作用的影响。
- 使用柯里化增加函数适用率。
- 使用 Pointfree 编程风格，减少无意义的中间变量，让代码更且可读性。
- ……