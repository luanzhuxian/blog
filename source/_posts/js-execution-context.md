---
title: JavaScript 中的执行栈、执行上下文和作用域
comments: true
categories: javascript
tags: javascript
abbrlink: 767a45e1
date: 2019-05-09 14:11:31
---

# 执行栈
执行栈，也叫调用栈，具有 LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。  
首次运行 JS 代码时，会创建一个全局执行上下文并 Push 到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并 Push 到当前执行栈的栈顶。  
根据执行栈 LIFO 规则，当栈顶函数运行完成后，其对应的函数执行上下文将会从执行栈中 Pop 出，上下文控制权将移到当前执行栈的下一个执行上下文。  
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

# 执行上下文
执行上下文是当前 JavaScript 代码被解析和执行时所在环境的抽象概念。帮助 JavaScript 引擎管理整个解析和运行代码的复杂过程。  

## 执行上下文的类型
分为全局执行上下文和函数执行上下文。

### 1. 全局执行上下文
Javascript 引擎首次开始解析代码时创建。只有一个。  
最初，这个全局上下文由一个全局对象和一个 this 变量组成。浏览器中的全局对象就是 window 对象，Node 环境中是 global 对象，this 指向这个全局对象。  
即使没有任何代码，全局执行上下文中仍然有 window 和 this。这就是最基本的全局执行上下文：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_1.png)
让我们看看添加了代码会怎么样：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_2.png)
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_3.png)
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
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_4.gif)
当调用了 getUser，就创建了新的执行上下文。在 getUser 执行上下文的创建阶段的创建阶段，Javascript 引擎创建了 this 对象和 arguments 对象。getUser 没有任何变量，所以 Javascript 引擎不需要再次分配内存或进行提升。  

你可能注意到了，当 getUser 函数执行完毕，它就从视图中消失了。事实上，Javascript 引擎创建了一个叫 执行栈（调用栈）的东西。每当函数被调用，就创建一个新的执行上下文并把它加入到调用栈；每当一个函数运行完毕，就被从调用栈中弹出来。因为 Javascript 是单线程的，每一个新的执行上下文都嵌套在另一个中，形成了调用栈。  
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_5.gif)

我们来改写之前的代码，让函数拥有局部变量。
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_6.gif)
这里有几处重要细节需要注意。  
首先，传入函数的所有参数都作为局部变量存在于该函数的执行上下文中。在例子中，handle 同时存在与全局执行上下文和 getURL 执行上下文中，因为我们把它传入了 getURL 函数做为参数。  
其次，在函数中声明的变量存在于函数的执行上下文中。所以当我们创建 twitterURL，它就会存于 getURL 执行上下文中。这看起来显而易见，但却是`作用域`的基础。  

### 3. Eval 函数执行上下文
指的是运行在 eval 函数中的代码，很少用而且不建议使用。  
<br>

## 执行上下文的创建
执行上下文分两个阶段创建：创建阶段、执行阶段。
### 创建阶段
An execution context has the following fields:  
Environments: LexicalEnvironment and VariableEnvironment are what keep track of variables during runtime. Two references to environments. Both are usually the same.  

- LexicalEnvironment (lookup and change existing): resolve identifiers.
- VariableEnvironment (add new): hold bindings made by variable declarations and function declarations.
- ThisBinding: the current value of this.
```
  ExecutionContext = {
    ThisBinding = <this value>,     // 确定this
    LexicalEnvironment = { ... },   // 词法环境
    VariableEnvironment = { ... },  // 变量环境
  }
```
#### 1. 确定 this 的值（This Binding）
- 全局执行上下文中，this 的值指向全局对象。
- 函数执行上下文中，this 的值取决于函数的调用方式。具体有：默认绑定、隐式绑定、显式绑定、new 绑定、箭头函数。  


#### 2. 创建词法环境（Lexical Environment）
<blockquote bgcolor=#FF4500 style="margin-bottom: 30px">**Lexical environments** hold variables and parameters. The currently active environment is managed via a stack of execution contexts (which grows and shrinks in sync with the call stack). Nested scopes are handled by chaining environments: each environment points to its outer environment (whose scope surrounds its scope). In order to enable lexical scoping, functions remember the scope (=environment) they were defined in. When a function is invoked, a new environment is created for is arguments and local variables. That environment’s outer environment is the function’s scope. </blockquote>    

词法环境有三种类型：
- 全局环境（Global Environment）：是一个没有外部环境的词法环境，其外部环境引用为 null。拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，this 的值指向这个全局对象。
- 函数环境（Function Environment）：用户在函数中定义的变量被存储在环境记录中，包含了`arguments`对象。其外部环境可以是全局环境，也可以是包含内部函数的外部函数环境。  
- 模块环境（Module Environment）：每个模块有自己的词法环境，存储了包括`imports`在内的所有的`top-level declarations`。其外部环境引用为全局环境。  

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_11.jpg)

**Data Structures：A (lexical) environment is the following data structure**  
每种词法环境有两个字段：一个`Environment Record`，还有一个指向外层`Lexical Environment`的可空引用。
- **环境记录（Environment Record）：**An environment record maps identifiers to value. that maps variable names to variable values. This is where JavaScript stores variables. One key-value entry in the environment record is called a binding. 存储变量和函数声明的实际位置。它包括3个子类：
  - **Declarative Environment Record：**store the effects of variable declarations, and function declarations.
  - **Object Environment Record：**are used by the with statement and for the global environment. They turn an object into an environment. For with, that is the argument of the statement. For the global environment, that is the global object.
  - **Global Environment Record**
- **对外部环境的引用：**A reference to the outer environment (null in the global environment) - the environment representing the outer scope of the scope represented by the current environment. 可以访问其外部词法环境。  

其中`Declarative Environment Record`又有两个子类：`Function Environment Records`和`Module Environment Records`。
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_12.jpg)

```
  GlobalExectionContext = {     // 全局执行上下文
    LexicalEnvironment: {    	  // 词法环境
      EnvironmentRecord: {   		// 环境记录
        Type: "Object",      		// 全局环境
        outer: <null>  	   		  // 对外部环境的引用
      }  
    }
  }

  FunctionExectionContext = {      // 函数执行上下文
    LexicalEnvironment: {  	       // 词法环境
      EnvironmentRecord: {  		   // 环境记录
        Type: "Declarative",  	   // 函数环境
        outer: <Global or outer function environment reference>  // 对外部环境的引用
      }  
    }
  }
```

#### 3. 创建变量环境（Variable Environment）
变量环境也是一个词法环境，variable environment is a certain type of lexical environment，因此它具有上面定义的词法环境的所有属性。  
在 ES6 中，`词法环境`和`变量环境`的区别在于前者用于存储`函数声明和变量（let const）`绑定，而后者仅用于存储`变量（var）`绑定。

例子：
```
  let a = 20
  const b = 30
  var c

  function multiply(e, f) {  
   var g = 20
   return e * f * g;
  }

  c = multiply(20, 30)
```
执行上下文如下所示：
```
  // 全局执行上下文
  GlobalExectionContext = {

    ThisBinding: <Global Object>,

    // 词法环境
    LexicalEnvironment: {  
      EnvironmentRecord: {  
        Type: "Object",
        a: < uninitialized >,
        b: < uninitialized >,
        multiply: < func >
      }  
      outer: <null>
    },

    // 变量环境
    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Object",
        c: undefined
      }  
      outer: <null>
    }  
  }

  // 函数执行上下文，函数被调用的时候才会被创建
  FunctionExectionContext = {  

    ThisBinding: <Global Object>,

    LexicalEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",
        Arguments: {0: 20, 1: 30, length: 2}
      },  
      outer: <GlobalLexicalEnvironment>
    },

    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",
        g: undefined
      },  
      outer: <GlobalLexicalEnvironment>
    }  
  }
```

### 执行阶段
此阶段，完成对所有变量的分配，最后执行代码。  
如果 Javascript 引擎在源代码中声明的实际位置找不到 let 变量的值，那么将为其分配 undefined 值。  

### LexicalEnvironment 和 VariableEnvironment 的区别
Both are usually the same. The following explain situations where they diverge.  

**Handling temporary scopes via LexicalEnvironment and VariableEnvironment：**  

![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_13.png)
LexicalEnvironment and VariableEnvironment are always the same, except in one case: When there is a dominant outer scope and one temporarily wants to enter an inner scope. In the inner scope, a few new bindings should be accessible, but all new bindings made inside of it should be added to the outer scope. This is done as follows:
- LexicalEnvironment temporarily points to a new environment that has been put in front of the old LexicalEnvironment. The new environment holds the temporary bindings of the inner scope.
- VariableEnvironment does not change its value and is thus still the same as the old LexicalEnvironment, denoting the outer scope. New bindings are added here and will also be found when doing a lookup via LexicalEnvironment, because the latter comes before the former in the environment chain.
- After leaving the temporary scope, LexicalEnvironment’s old value is restored and it is again the same as VariableEnvironment.  

These differences matter for with statements and catch clauses, which create temporary scopes. In both cases, the dominant scope is the surrounding function.
- with statement: the object that is the argument of the statement becomes a temporary environment.
- catch clause: the exception that is the argument of this clause is made available via a temporary environment.  

举个例子：  
```
  function do_something() {
      let b = 2
      var a = 1
      while (true) {
          var c = 3
          let d = 4
          console.log(b)
          break
      }
  }
  do_something()
```
当调用该方法时，创建了一个`ExecutionContext`：
```
  ExecutionContext:
      LexicalEnvironment:
          b: < uninitialized >,
          outer: VariableEnvironment
      VariableEnvironment:
          a: undefined,
          c: undefined, // 变量提升
          outer: <GlobalLexicalEnvironment>
    ...
```
当今图`while循环`时创建了一个新的`LexicalEnvironment`：
```
  ExecutionContext:
      LexicalEnvironment:
          d: < uninitialized >,
          outer: <LexicalEnvironment>
                  b: 2
                  outer: <GlobalLexicalEnvironment>
      VariableEnvironment:
          a: 1,
          c: undefined, // 变量提升
          outer: <GlobalLexicalEnvironment>
    ...
```
Now when we look up variables, we can always fall back on whatever is contained in outer.   
当`while block`结束，我们恢复 `LexicalEnvironment`。
```
ExecutionContext:
      LexicalEnvironment:
          b: 2,
          outer: GlobalLexicalEnvironment
      VariableEnvironment:
          a: 1,
          c: 3,
          outer: <GlobalLexicalEnvironment>
    ...
```
无法访问到 d 了。所以当`while`循环结束后，它的`execution context`被销毁。
<br>

# 变量提升
在创建阶段，函数声明存储在环境中，而变量会被设置为 undefined（在 var 的情况下）或保持未初始化（在 let 和 const 的情况下）。所以这就是为什么可以在声明之前访问 var 定义的变量（尽管是 undefined ），但如果在声明之前访问 let 和 const 定义的变量就会提示引用错误的原因。这就是所谓的变量提升。

# 作用域
我们可以把作用域看作是`变量可访问之处`，正如我们理解执行上下文那样。  

这里有一个小测试。下面代码中，打印出来的 bar 将会是什么？
```
  function foo() {
    var bar='Declared in foo'
  }
  foo()
  console.log(bar)
```
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_7.gif)
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
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_8.gif)

控制台会依次打印出 undefined、Jordyn、Jake、Tyler。  
因为每个新的执行上下文都有它自己的变量环境。就算另有其他执行上下文包含变量 name，Javascript 引擎仍会先从当前执行上下文里找起。  

# 作用域链
这就带来一个问题，要是当前执行上下文里没有要找的变量呢？Javascript 会就此罢手吗？下面的例子里有答案。
```
  var name='Tyler'
  function logName() {
    console.log(name)
  }
  logName()
```
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_9.gif)
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
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/execution-context_10.gif)
注意，makeAdder 执行上下文从调用栈弹出后，创建了一个 Closure Scope（闭包作用域）。Closure Scope 中的变量环境和 makeAdder 执行上下文中的变量环境相同。这是因为我们在函数中嵌入了另一个函数。  
在本例中，inner 函数嵌在 makeAdder 中，所以 inner 在 makeAdder 变量环境的基础上创建了一个闭包。因为闭包作用域的存在，即使 makeAdder 已经从调用栈弹出了，inner 仍然能够访问到 x 变量（通过作用域链）。
