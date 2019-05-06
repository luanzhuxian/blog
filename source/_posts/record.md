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

# Currying（柯里化）
柯里化是一个带有多个参数的函数并将其转换为函数序列的过程，每个函数只有一个参数。  
一个有n个参数的函数，可以使用柯里化将它变成一个一元函数。
```
  const binaryFunction = (a, b) => a + b
  const curryUnaryFunction = a => b => a + b
  curryUnaryFunction(1) // returns a function: b => 1 + b
  curryUnaryFunction(1)(2) // returns the number 3
```
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
```
  var compose = function (f, g) {
    return function (x) {
      return f(g(x))
    }
  }
  // 或
  var compose = (f, g) => (x) => f(g(x))

  var toUpperCase = (x) => x.toUpperCase()
  var exclaim = (x) => return x + '!'
  var shout = compose(exclaim, toUpperCase)

  shout("send in the clowns") //=> "SEND IN THE CLOWNS!"
```
对比组合的函数，完整流程函数不可拆解，出厂的时候已经设计好了
```
  var shout = (x) => exclaim(toUpperCase(x))
```
组合函数实现反转数组：
```
  var head = x => x[0]
  var reverse = x => x.reduce((arr, x) => [x].concat(arr), [])
  var last = compose(head, reverse)
  last(['jumpkick', 'roundhouse', 'uppercut']) //=> 'uppercut'
```
结合律：
```
  var associative = compose(f, compose(g, h)) == compose(compose(f, g), h)  // true

  compose(toUpperCase, compose(head, reverse))
  // 或
  compose(compose(toUpperCase, head), reverse)
```
结合律的好处是任何一个函数分组都可以被拆解开来，然后再以他们自己的组合打包在一起，组合成新的函数。下面用到了上面 compose 、head、reverse 函数：
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

# reduce
reduce方法返回值是回调函数最后一次执行返回的累积结果。  
## 使用 reduce 做到同时有 map 和 filter 的作用
```
  const numbers = [10, 20, 30, 40]
  const doubledOver50 = numbers.reduce((finalList, num) => {
    num = num * 2 // double each number
    if (num > 50) { // filter number > 50
      finalList.push(num)
    }
    return finalList
  }, [])
  doubledOver50 // [60, 80]
```

## 使用 reduce 代替 map
```
  function map (arr, exec) {
      const res = arr.reduce((res, item, index) => {
          const newItem = exec(item, index)
          res.push(newItem)
          return res
      }, [])
      return res
  }

  [1, 2, 3].map((item) => item * 2) // [2, 4, 6]
  map([1, 2, 3], item => item * 2) // [2, 4, 6]
```

## 使用 reduce 代替 filter
```
  function filter (arr, exec) {
    var res = arr.reduce((res, item, index) => {
        if (exec(item, index)) {
            res.push(item)
        }
        return res
    }, [])
    return res
  }

  [1, 2, 3].filter((item, index) => index < 2) // [1, 2]
  filter([1, 2, 3], (item, index) => index < 2) // [1, 2]
```

## 使用 redece 来判断括号是否匹配
这个例子说明 reduce 这个函数功能的强大。给你一串字符串，你想要知道这串字符串的括号是否是匹配。  
常规的做法是使用栈来匹配，但是这里我们使用 reduce 就可以做到，我们只需要一个变量 counter ，这个变量的初始值是 0 , 当遇到`(`的时候，`counter++`当遇到`)`的时候，`counter--`。 如果括号是匹配的，那么这个 counter 最终的值是 0。
```
  //Returns 0 if balanced.
  const isParensBalanced = (str) => {
    return str.split('').reduce((counter, char) => {
      if (counter < 0) { // matched ")" before "("
        return counter
      } else if (char === '(') {
        return ++counter
      } else if (char === ')') {
        return --counter
      } else { // matched some other charreturn counter;
      }
    }, 0) // starting value of the counter
  }
  isParensBalanced('(())') // 0 <-- balanced
  isParensBalanced('(asdfds)') //0 <-- balanced
  isParensBalanced('(()') // 1 <-- not balanced
  isParensBalanced(')(') // -1 <-- not balanced
```

## 计算数组中元素出现的次数(将数组转为对象)
如果你想计算数组中元素出现的次数或者想把数组转为对象，那么你可以使用 reduce 来做到。
```
  const cars = ['BMW','Benz', 'Benz', 'Tesla', 'BMW', 'Toyota']
  const carsObj = cars.reduce((obj, name) => {
    obj[name] = obj[name] ? ++obj[name] : 1
    return obj
  }, {})
  carsObj // { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 }
```

# 对象解构
## 移除不想要的属性
```
  let {_internal, tooBig, ...cleanObject} = {el1: '1', _internal:"secret", tooBig:{}, el2: '2', el3: '3'} // 移除 _internal 和 tooBig 这两个属性
  cleanObject // {el1: '1', el2: '2', el3: '3'}
```

## 在函数参数中使用嵌套对象解构
在这个例子中 engine 是一个嵌套在 car 里面的对象，如果我们只需要 engine 里面的属性 vin 我们可以这样做。
```
  const car = {
    model: 'bmw 2018',
    engine: {
      v6: true,
      turbo: true,
      vin: 12345
    }
  }
  const modelAndVIN = ({model, engine: {vin}}) => {
    console.log(`model: ${model} vin: ${vin}`)
  }
  modelAndVIN(car) // model: bmw 2018  vin: 12345
```
## 合并对象
扩展运算符...
```
  let object1 = { a:1, b:2,c:3 }
  let object2 = { b:30, c:40, d:50}
  let merged = {…object1, …object2} //spread and re-add into merged
```

# Sets
## 使用 set 来对数组去重
```
  let arr = [1, 1, 2, 2, 3, 3]
  let deduped = [...new Set(arr)] // [1, 2, 3]
```

## 使用 Array 的方法
可以通过 (...) 扩展运算符将 Set 转换成 Array 这样我们就可以在 Set 使用所有 Array 的方法了。
```
  let mySet = newSet([1,2, 3, 4, 5])
  const filtered = [...mySet].filter((x) => x > 3) // [4, 5]
```

# 数组的解构
## 交换2个值
```
  const [post, comments] = Promise.all([
    fetch('/post'),
    fetch('/comments')
  ])
```

# vue 监听数组长度变化
```
  var vm = new Vue({
    el: 'body',
    data: {
      list: []
    },
    computed: {
      length () {
        return this.list.length
      }
    },
    watch: {
      list: {
        deep: true,
        handler (newValue, oldValue) {
          console.log(newValue.length)
        }
      }
    }
  })
```

# vue 监听对象变化
```
  var vm = new Vue({
    el: 'body',
    data: {
      items: {}
    },
    computed: {
      isEmpty () {
        return Object.keys(this.items).length === 0
      }
    },
    watch: {
      items: {
        deep: true,
        handler (newValue, oldValue) {
          this.isEmpty = Object.keys(newValue).length === 0
        }
      }
    }
  })
```

# DOM 节点列表转化成数组的几种方式
1. for 循环
2. Array.prototype.slice.call(NodeList)
3. Array.from(NodeList)
ES6 为了增加语义的清晰，语法的简洁性。添加了一个新方法 Array.from，用于将 arrayLike 的对象转换成数组。
4. 数组/对象扩展运算符 arr = [...NodeList]
