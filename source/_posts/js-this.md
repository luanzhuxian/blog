---
title: Javascript 中的 this
comments: true
categories: javascript
tags: javascript
abbrlink: 5fc1eac8
date: 2019-05-08 10:34:32
---

# 为什么要用 this
试想下面代码如果不使用 this 应该怎么写：
```
  function speak(){
    var name = this.name
    console.log(`Hello I am ${name}`)
  }
  var me = {
    name: 'a',
    speak: speak
  }
  var you = {
    name: 'b',
    speak: speak
  }
  me.speak()  //Hello I am a
  you.speak()  //Hello I am b
```
this 可以在同一个执行环境中使用不同的上下文对象。它其实提供了一种更加优雅的方式来隐式传递一个对象引用，因此可以使 API 设计的更加简洁且易于复用。

# this 指向谁
<blockquote bgcolor=#FF4500>当一个函数被调用时，会创建一个活动记录（执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息，this 也是其中的一个属性。</blockquote>
this 是运行时绑定的，所以取决于函数的执行上下文。确定 this 指向就是确定函数的执行上下文，也就是谁调用的它，有以下几种判断方式：

## 独立函数调用
这种直接调用的方式 this 指向全局对象，如果是在浏览器就指向 window。
```
  function foo(){
    console.log(this.a)
  }
  var a = 2
  foo()  // 2
```

## 对象上下文（隐式绑定）
foo 虽然被定义在全局作用域，但是调用的时候是通过 obj 上下文引用的，可以理解为在 foo 调用的那一刻它被 obj 对象拥有。所以 this 指向 obj。
```
  function foo() {
    console.log(this.a)
  }
  var obj = {
    a: 2,
    foo: foo
  }
  obj.foo() // 2
```
这里有两个问题：
1. 链式调用：链式调用的情况下只有最后一层才会影响调用位置
```
  obj1.obj2.obj3.fn() //这里的fn中的this指向obj3
```
2. 引式丢失
```
  function foo() {
    console.log(this.a)
  }
  var obj = {
    a: 2,
    foo: foo
  }
  var bar = obj.foo
  var a = "xxxxx"
  bar() // xxxxx
```
  回调函数其实就是隐式丢失
  ```
    function foo() {
      console.log(this.a)
    }
    var obj = {
      a: 2,
      foo: foo
    }
    var a = "xxxxx"
    setTimeout(obj.foo, 100) // xxxxx
  ```
  我们看到，回调函数虽然是通过 obj 引用的，但是 this 也不是 obj 了。其实内置的 setTimeout() 函数实现和下面的伪代码类似：
  ```
    function setTimeout(fn, delay){
      //等待delay毫秒
      fn()
    }
  ```
  这段代码隐藏这一个操作就是`fn = obj.foo`，这和上面例子中的`bar = obj.foo`异曲同工。

## 显式绑定
显式绑定的说法是和隐式绑定相对的，指的是通过 call、apply、bind 显式地更改 this 指向。这三个方法第一个参数是 this 要指向的对象。  
这三个方法中的 bind 方法比较特殊，它可以延迟方法的执行，这可以让我们写出更加灵活的代码。它的原理也很容易模拟：
```
  function foo(something) {
    console.log(this.a, something)
    return this.a + something
  }
  function bind(fn, obj) {
    return function() {
      return fn.apply(obj, arguments)
    }
  }
  var obj = { a:2 }
  var bar = bind(foo, obj)
  var b = bar(3) // 2 3
  console.log(b) // 5
```

## new 绑定
js 中 new 与传统的面向类的语言机制不同，js中的构造函数其实和普通函数没有任何区别。其实当我们使用new来调用函数的时候，发生了下列事情：
- 创建一个全新的对象
- 这个新对象会被执行原型链接
- 这个新对象会被绑定到调用的this
- 如果函数没有对象类型的返回值，这个对象会被返回  

其中，第三步绑定了 this，所以构造函数和原型中的 this 永远指向 new 出来的实例。

## 箭头函数中的 this
箭头函数不是通过 function 关键字定义的，也不使用上面的 this 规则，而是继承外层作用域中的 this 指向。  
其实以前虽然没有箭头函数，我们也经常做和箭头函数一样效果的事情，比如说：
```
  function foo() {
    var self = this
    setTimeout(function(){
      console.log( self )
    }, 100)
  }
```

## getter 与 setter 中的 this
getter 或 setter 函数都会把 this 绑定到设置或获取属性的对象上：
```
  function sum() {
    return this.a + this.b + this.c;
  }
  var o = {
    a: 1,
    b: 2,
    c: 3,
    get average() {
      return (this.a + this.b + this.c) / 3;
    }
  }
  Object.defineProperty(o, 'sum', { get: sum, enumerable: true, configurable: true} )
  console.log(o.average, o.sum) // 2, 6
```

# 严格模式下的差异
以上所说的都是在非严格模式下成立，严格模式下的 this 指向是有差异的。
- 独立函数调用：this 指向 undefined
- 对象上的方法：this 永远指向该对象

# 例子
```
  let a = {
    b: 1,
    length: 2,
    test () {
      console.log(this.b)
      console.log(this.length)
    }
  }

  let b = a.test
  b() // undefined, 0
  a.test()  // 1, 2

  // ES5中，顶层对象的属性等价于全局变量
  // ES6中，var、function声明的全局变量，依然是顶层对象的属性；let、const、class声明的全局变量不属于顶层对象的属性，也就是说ES6开始，全局变量和顶层对象的属性开始分离。
  var b = a.test
  b() // ƒ test () {}, 0

  let c = {
    b: 3,
    length: 4,
    test () {
      b()
      a.test()
      a.test.apply(arguments)
    }
  }

  let d = c.test
  d() // undefined, 0, 1, 2, undefined, 0
  c.test() // undefined, 0, 1, 2, undefined, 0
  c.test(1) // undefined, 0, 1, 2, undefined, 1
```
