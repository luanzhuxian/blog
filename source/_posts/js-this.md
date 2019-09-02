---
title: JavaScript 中的 this
comments: true
categories: javascript
tags: javascript
abbrlink: 5fc1eac8
date: 2019-05-08 10:34:32
---

# 为什么要用 this
试想下面代码如果不使用 this 应该怎么写：
```
  function speak() {
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
人们很容易把 this 理解成指向函数自身，其实 this 的指向在函数定义阶段是无法确定的，只有函数执行时才能确定 this 到底指向谁，实际上 this 的最终指向是调用它的那个对象。  
<blockquote bgcolor=#FF4500>当一个函数被调用时，会创建一个活动记录（执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息，this 也是其中的一个属性。</blockquote>
this 是运行时绑定的，所以取决于函数的执行上下文。确定 this 指向就是确定函数的执行上下文，也就是谁调用的它，有以下几种判断方式：

## 独立函数调用（默认绑定）
这种直接调用的方式 this 指向全局对象，如果是在浏览器就指向 window。
```
  var a = 2
  function foo() {
    console.log(this.a)
  }

  foo()  // 2
```
for 循环中的`foo(i)`调用它的对象是 window，等价于`window.foo(i)`，因此函数 foo 里面的`this.count++`的 this 指向的是 window。
```
  function foo(num) {
    console.log("foo: " + num)
    this.count++  //记录foo被调用次数
  }

  foo.count = 0
  for (let i=0; i<10; i++) {
    if (i > 5) {
        foo(i)
    }
  }
  console.log(foo.count) // 0
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
    function setTimeout(fn, delay) {
      //等待delay毫秒
      fn()
    }
  ```
  这段代码隐藏这一个操作就是`fn = obj.foo`，这和上面例子中的`bar = obj.foo`异曲同工。

## 显式绑定
显式绑定的说法是和隐式绑定相对的，指的是通过 call、apply、bind 显式地更改 this 指向。这三个方法第一个参数是 this 要指向的对象。  
```
  function fruit() {
      console.log(this.name, arguments);
  }

  var apple = {
      name: '苹果'
  }

  var banana = {
      name: '香蕉'
  }

  fruit.call(banana, banana, apple)  // 香蕉 { '0': { name: '香蕉' }, '1': { name: '苹果' } }
  fruit.apply(apple, [banana, apple]) // 苹果 { '0': { name: '香蕉' }, '1': { name: '苹果' } }
```
这三个方法中的 bind 方法比较特殊，它可以延迟方法的执行，这可以让我们写出更加灵活的代码。它的原理也很容易模拟：
```
  function foo(something) {
    return this.a + something
  }

  // fn 的 this 指向 obj
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
js 中 new 与传统的面向类的语言机制不同，js 中的构造函数其实和普通函数没有任何区别。其实当我们使用 new 来调用函数的时候，发生了下列事情：
- 创建一个全新的对象
- 这个新对象会被执行原型链接
- 这个新对象会被绑定到调用的this
- 如果函数没有对象类型的返回值，这个对象会被返回  

其中，第三步绑定了 this，所以构造函数和原型中的 this 永远指向 new 出来的实例。

## 箭头函数中的 this
箭头函数自身不绑定 this，箭头函数并非使用 function 关键字进行定义，也不会使用上面的 this 标准规范，而是<font color=red>继承外层作用域、函数调用中的 this 绑定</font>。由于箭头中的 this 的<font color=red>作用域继承自执行上下文</font>，因此 this 的值将在<font color=red>调用堆栈中查找</font>。  

- 没有`this、super、arguments、new.target`绑定，由外围最近一层非箭头函数决定。  
- 不能通过new关键字调用  
箭头函数没有`[[Construct]]`，所以不能用作构造函数
- 没有原型
因为不能通过 new 关键字调用，没有构造原型的需求，所以箭头函数不存在 prototype 属性
- 不可以改变 this 的绑定
执行`fruit.call(apple)`时，箭头函数 this 已被绑定，无法再次被修改：  
```
  function fruit() {
    return () => {
      console.log(this.name)
    }
  }

  var apple = {
    name: '苹果'
  }

  var banana = {
    name: '香蕉'
  }

  var fruitCall = fruit.call(apple)

  fruitCall.call(banana) // 苹果
```
- 箭头函数不适合作为对象方法，箭头函数也不适合使用创建构造函数。
```
  // 常规函数
  const car = {
    model: 'Fiesta',
    manufacturer: 'Ford',
    fullName: function() {
      return `${this.manufacturer} ${this.model}`
    }
  }
  car.funName() // Ford Fiesta

  // 箭头函数
  const car = {
    model: 'Fiesta',
    manufacturer: 'Ford',
    fullName: () => {
      return `${this.manufacturer} ${this.model}`
    }
  }
  car.funName() // undefined undefined
```
- 在事件监听器上使用箭头函数也会存在问题。因为 DOM 事件侦听器会自动将 this 与目标元素绑定，如果该事件处理程序的逻辑依赖 this，那么需要常规函数。
```
  // 常规函数
  const link = document.querySelector('#link')
  link.addEventListener('click', function() {
    // this === link
  })

  // 箭头函数
  const link = document.querySelector('#link')
  link.addEventListener('click', () => {
    // this === window
  })
```
- 其实以前虽然没有箭头函数，我们也经常做和箭头函数一样效果的事情，比如说：
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
      console.log(this)
      console.log(this.b)
      console.log(this.length)
    }
  }

  let b = a.test
  b() // window, undefined, 0
  a.test()  // {b: 1, length: 2, test: ƒ}, 1, 2

  // ES5中，顶层对象的属性等价于全局变量
  // ES6中，var、function声明的全局变量，依然是顶层对象的属性；let、const、class声明的全局变量不属于顶层对象的属性，也就是说ES6开始，全局变量和顶层对象的属性开始分离。
  var b = a.test
  b() // window, ƒ test () {}, 0

  let c = {
    b: 3,
    length: 4,
    test () {
      b()     // 直接调用 this 永远指向 window
      a.test()
      a.test.apply(arguments)
    }
  }

  let d = c.test
  d()      // window, undefined, 0,
              { b: 1, length: 2, test: ƒ }, 1, 2,
              Arguments, undefined, 0

  c.test() // window, undefined, 0,
              { b: 1, length: 2, test: ƒ }, 1, 2,
              Arguments, undefined, 0

  c.test(1) // window, undefined, 0,
               { b: 1, length: 2, test: ƒ }, 1, 2,
               Arguments, undefined, 1
```

```
  function x() {
    console.log(this)
  }

  const y = {
    name: 'y',
    run () {
      x()
    }
  }

  const z = {
    name: 'z'
  }

  y.run() //  window

  x.apply(z)  //  {name: "z"}

  z.run = x
  z.run()     //  {name: "z", run: ƒ}
```
