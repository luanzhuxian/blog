---
title: JavaScript 中的执行栈、执行上下文
comments: true
categories: javascript
tags: javascript
abbrlink: 767a45e1
date: 2019-05-12 21:11:31
---

之前的相关文章：
[JavaScript 的作用域](https://www.luanzhuxian.com/post/cd6f8c2a.html)  
[JavaScript 中的执行上下文、词法环境、变量环境](https://www.luanzhuxian.com/post/64e2dbce.html)  
[JavaScript 中的 this](https://www.luanzhuxian.com/post/5fc1eac8.html)  


# 执行栈
执行栈，也叫调用栈，具有`LIFO（后进先出）`结构，由`Javascript`引擎创建，用于存储在代码执行期间创建的所有执行上下文。  
首次运行`JS`代码时，会创建一个全局执行上下文并`push`到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并`push`到当前执行栈的栈顶。  
根据执行栈`LIFO`规则，当栈顶函数运行完成后，其对应的函数执行上下文将会从执行栈中`pop`出，上下文控制权将移到当前执行栈的下一个执行上下文。  
```
  var a = 'Hello World!';

  function first() {  
    console.log('Inside first function');  
    second();  
    console.log('Again inside first function');  
  }

  function second() {  
    console.log('Inside second function');  
  }

  first();  
  console.log('Inside Global Execution Context');

  // Inside first function
  // Inside second function
  // Again inside first function
  // Inside Global Execution Context
```

# 执行上下文（Execution Context）
执行上下文是当前`JavaScript`代码被解析和执行时所在环境的抽象概念。帮助`JavaScript`引擎管理整个解析和运行代码的复杂过程。   
执行上下文是在代码运行的时候确定的，是可以改变的。  

## 执行上下文的类型
分为全局执行上下文和函数执行上下文。

### 1. 全局执行上下文
Javascript 引擎首次开始解析代码时创建。只有一个。  
最初，这个全局上下文由一个全局对象和一个 this 变量组成。浏览器中的全局对象就是 window 对象，Node 环境中是 global 对象，this 指向这个全局对象。  
即使没有任何代码，全局执行上下文中仍然有 window 和 this。这就是最基本的全局执行上下文：
![avatar](/images/blog/execution-context/execution-context_1.png)
让我们看看添加了代码会怎么样：
![avatar](/images/blog/execution-context/execution-context_2.png)
![avatar](/images/blog/execution-context/execution-context_3.png)
能看出上面两张图的区别吗？关键在于每个执行上下文有两个独立的阶段，一个是创建阶段，一个是执行阶段，每个阶段都有其各自职责。  

在全局执行上下文的创建阶段，Javascript 引擎会：
1. 创建一个全局对象；
2. 创建 this 对象；
3. 给变量和函数分配内存；
4. 给变量赋默认值 undefined，把所有函数声明放进内存。  

直到执行阶段，Javascript 引擎才会一行一行地运行你的代码并执行它们。  

### 2. 函数执行上下文
**只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文**。存在无数个。  

在函数执行上下文的创建阶段，Javascript 引擎会：
1. 创建一个 arguments 对象；
2. 创建 this 对象；
3. 给变量和函数分配内存；
4. 给变量赋默认值 undefined，把所有函数声明放进内存。  

让我们回过头看看之前的代码，但这次我们不仅仅定义 getUser，还要调用一次，看看实际效果是什么。
![avatar](/images/blog/execution-context/execution-context_4.gif)
当调用了 getUser，就创建了新的执行上下文。在 getUser 执行上下文的创建阶段的创建阶段，Javascript 引擎创建了 this 对象和 arguments 对象。getUser 没有任何变量，所以 Javascript 引擎不需要再次分配内存或进行提升。  

当`getUser`函数执行完毕，它就从视图中消失了。事实上，每当函数被调用，就创建一个新的执行上下文并把它加入到调用栈；每当一个函数运行完毕，就被从调用栈中弹出来。因为`Javascript`是单线程的，每一个新的执行上下文都嵌套在另一个中，形成了调用栈。  
![avatar](/images/blog/execution-context/execution-context_5.gif)

我们来改写之前的代码，让函数拥有局部变量。
![avatar](/images/blog/execution-context/execution-context_6.gif)
这里有几处重要细节需要注意。  
首先，传入函数的所有参数都作为局部变量存在于该函数的执行上下文中。在例子中，handle 同时存在与全局执行上下文和 getURL 执行上下文中，因为我们把它传入了 getURL 函数做为参数。  
其次，在函数中声明的变量存在于函数的执行上下文中。所以当我们创建 twitterURL，它就会存于 getURL 执行上下文中。这看起来显而易见，但却是作用域的基础。  

### 3. Eval 函数执行上下文
指的是运行在 eval 函数中的代码，很少用而且不建议使用。  


# 作用域
作用域指的是代码中特定变量的有效范围，规定了如何查找变量，确定当前执行代码对变量的访问权限。`JavaScript`采用静态作用域。代码写在哪里作用域就在哪里确定，函数在定义的时候（不是调用的时候）就已经确定了函数体内部自由变量的作用域。作用域确定了就不会再变化。  

# 作用域链
这就带来一个问题，要是当前执行上下文里没有要找的变量呢？Javascript 会就此罢手吗？下面的例子里有答案。
```
  var name='Tyler'
  function logName() {
    console.log(name)
  }
  logName()
```
![avatar](/images/blog/execution-context/execution-context_9.gif)
如果 Javascript 引擎在函数执行上下文找不到匹配的局部变量，它会到最接近的父级上下文中查找。这条查找链会一直延伸到全局执行上下文。如果此时仍然找不到该变量，Javascript 引擎就会抛出一个引用错误。  

# 闭包
之前我们了解到函数中创建的变量仅局部有效，一旦函数执行上下文从调用栈弹出，这些变量就访问不到了。  
如果你在一个函数中嵌入了另一个函数，情况就变了。这种函数套函数的情况下，即使父级函数的执行上下文从调用栈弹出了，子级函数仍然能够访问父级函数的作用域。  
```
  var count=0
  function makeAdder(x) {
    return function inner(y) {
      return x + y
    }
  }
  var add5 = makeAdder(5)
  count += add5(2) // 7
```
![avatar](/images/blog/execution-context/execution-context_10.gif)
注意，makeAdder 执行上下文从调用栈弹出后，创建了一个 Closure Scope（闭包作用域）。Closure Scope 中的变量环境和 makeAdder 执行上下文中的变量环境相同。这是因为我们在函数中嵌入了另一个函数。  
在本例中，inner 函数嵌在 makeAdder 中，所以 inner 在 makeAdder 变量环境的基础上创建了一个闭包。因为闭包作用域的存在，即使 makeAdder 已经从调用栈弹出了，inner 仍然能够访问到 x 变量（通过作用域链）。

# 变量的查找规则  
先从当前的执行上下文中找保存的作用域（对象），在当前作用域的 Environment Record（对应的执行上下文）中查找对应的属性, 如果有直接返回, 否则通过作用域链向上查找，顺着`__outer__`在上一级作用域的里面的 Environment Record 中查找对应的属性，直到全局作用域, 如果还找不到就抛出找不到的异常。  

这里有一个小测试。下面代码中，打印出来的 bar 将会是什么？
```
  function foo() {
    var bar = 'Declared in foo'
  }
  foo()
  console.log(bar)
```
![avatar](/images/blog/execution-context/execution-context_7.gif)
当我们调用了 foo，就在调用栈中新增了一个执行上下文。在其创建阶段，产生了 this、arguments，bar 被设为 undefined。  
然后到了执行阶段，把字符串'Declare in foo'赋予 bar。到这里执行阶段就结束了，foo 执行上下文从调用栈弹出。  
foo 弹出后，代码就运行到了打印 bar 到控制台的部分。此刻会报错：`Uncaught ReferenceError: bar is not defined`。这告诉我们，在函数中创建的变量，它的作用域是局部的。**因为一旦函数的执行上下文从调用栈弹出，该函数中声明的变量就访问不到了。**  

再看一个例子。代码执行完毕后控制台会打印出什么？  
```
  function first() {
    var name = 'Jordyn'
    console.log(name)
  }

  function second() {
    var name = 'Jake'
    console.log(name)
  }

  console.log(name)

  var name = 'Tyler'
  first()
  second()
  console.log(name)
```
![avatar](/images/blog/execution-context/execution-context_8.gif)

控制台会依次打印出 undefined、Jordyn、Jake、Tyler。  
因为每个新的执行上下文都有它自己的变量环境。就算另有其他执行上下文包含变量 name，Javascript 引擎仍会先从当前执行上下文里找起。 

# 作用域与执行上下文
函数的每次调用都有与之紧密相关的作用域和上下文。从根本上来说，作用域是基于函数的，而上下文是基于对象的。 换句话说，作用域涉及到所被调用函数中的变量访问，并且不同的调用场景是不一样的。根据不同情况（new调用、显式绑定、隐式绑定、默认绑定、尖头函数）`this`所指向的上下文对象是不定的。  

作用域只是一个“地盘”，一个区域，是在函数声明的时候就确定的一套变量访问规则，而执行上下文是函数执行时才产生的一系列变量的集合体。  
在一个函数被执行时，创建的执行上下文对象除了保存了些代码执行的信息，还会把当前的作用域保存在执行上下文中。  
**作用域中没有变量，变量是通过作用域对应的执行上下文环境中的变量对象来实现的。也就是说作用域定义了执行上下文中的变量的访问规则，执行上下文是在这个作用域规则的前提下执行代码的。**  

所以作用域是静态观念的，而执行上下文环境是动态上的，两者并不一样。有闭包存在时，一个作用域存在两个上下文环境也是有的。  

同一个作用域下，对同一个函数的不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值，所以，作用域中变量的值是在执行过程中确定的，而作用域是在函数创建时就确定的。  

如果要查找一个作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中找到变量的值。  
 