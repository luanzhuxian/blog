---
title: JavaScript 中的执行上下文、词法环境、变量环境
comments: true
categories: javascript
tags: javascript
abbrlink: 64e2dbce
date: 2019-05-12 09:32:26
---

关于作用域请看另一篇文章：[JavaScript 的作用域](https://www.luanzhuxian.com/post/cd6f8c2a.html)   
关于`this`请看另一篇文章：[JavaScript 中的 this](https://www.luanzhuxian.com/post/5fc1eac8.html)  

上篇文章我们讲了作用域，知道`JavaScript`代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶段。编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。执行阶段由引擎完成，主要任务是执行可执行代码，执行上下文在这个阶段创建。现在我们聊聊执行上下文。  

# 执行上下文（Execution Context）

执行上下文是当前`JavaScript`代码被引擎解析和执行时所在环境的抽象概念。帮助`JavaScript`引擎管理整个解析和运行代码的复杂过程。为我们的可执行代码块提供了执行前的必要准备工作，例如变量对象的定义、作用域链的扩展、提供调用者的对象引用等信息。  
在代码执行过程中，可能会出现多个执行上下文，但运行的执行上下文最多只有一个。为了管理执行上下文，我们引入了执行上下文栈，处于栈顶的那个元素就是运行的执行上下文。当解释器遇到函数、块语句、`try...catch`时，都会创建一个新的执行上下文压入栈，成为当前上下文。   

## 执行上下文的生命周期
**创建阶段**  
- 用当前函数的参数列表`arguments`初始化一个`变量对象`并将当前执行上下文与之关联，函数代码块中声明的变量和函数将作为属性添加到这个`变量对象`上。在这一阶段，会进行变量和函数的初始化声明，变量统一定义为`undefined`需要等到赋值时才会有确值，而函数则会直接定义。
- 确定`this`
- 构建作用域链

**执行阶段**  
代码开始逐条执行，在这个阶段，引擎开始对定义的变量赋值，开始顺着作用域链访问变量，如果内部有函数调用就创建一个新的执行上下文压入执行栈并把控制权交出。  

**销毁阶段**  
函数执行完成后，当前执行上下文（局部环境）会被弹出执行上下文栈并且销毁，控制权被重新交给执行栈上一层的执行上下文。  

## 执行上下文的种类
分为全局执行上下文和函数执行上下文：    
- **全局执行上下文**：`Javascript`引擎首次开始解析代码时创建。只有一个。
- **函数执行上下文**：当一个函数被调用时，会创建一个活动记录（执行上下文），这个纪录会包含函数在哪里被调用（调用栈）、调用的方式、传入的参数等信息。`this`就是这个纪录的一个属性，会在函数执行的过程中用到。

## 执行上下文的结构
包含`词法环境（Lexical Environment）`，`变量环境（Variable Environment）`和`this`的值。  
An execution context has the following fields:  
Environments: LexicalEnvironment and VariableEnvironment are what keep track of variables during runtime. Two references to environments. Both are usually the same.
- **LexicalEnvironment**: resolve identifiers.（保存通过`let`、`const`、`with()`、`try-catch`创建的变量）
- **VariableEnvironment**: hold bindings made by variable declarations and function declarations.（保存通过`var`声明或`function(){}`声明的变量）
- **ThisBinding**: the current value of this.

## 执行上下文的抽象
我们将执行上下文抽象成伪代码，如下：
```
  ExecutionContext = {
    ThisBinding = <this value>,     // 确定this
    LexicalEnvironment = { ... },   // 词法环境
    VariableEnvironment = { ... },  // 变量环境
  }
```
词法环境和变量环境又是什么？  

# 环境（Environments）

我们看看 ECMAScript 5 中对`Environments`和`Execution Contexts`的解释：
<blockquote bgcolor=#FF4500 style="margin-bottom: 30px">**Lexical environments** hold variables and parameters. The currently active environment is managed via a stack of execution contexts (which grows and shrinks in sync with the call stack). Nested scopes are handled by chaining environments: each environment points to its outer environment (whose scope surrounds its scope). In order to enable lexical scoping, functions remember the scope (=environment) they were defined in. When a function is invoked, a new environment is created for it's arguments and local variables. That environment’s outer environment is the function’s scope. </blockquote> 

由此可知`环境`其实就是`作用域`。在规范中`作用域`更官方的叫法是`词法环境`，`词法环境`是`作用域`的内部实现机制。`环境`外部还有`环境`，形成链条，也就是`作用域链`。  
当函数被调用时，会创建新的执行上下文，其中包含：确定`this`指向和`环境`，相当于将`作用域`和`上下文`进行关联，将标识符保存在`环境记录`中。执行时引擎会根据作用域规则，查找参数和变量等标识符，找到的话就保存在`环境记录`中。  
随着执行栈的变化，随着执行函数的变化，当前的`环境`即`作用域`也是变化的，只是`环境`是函数定义时确定的，`this`是函数执行时确定的。看一个例子：  

```
    function foo () {
        console.log(color)
    }
    function bar () {
        const color = 'yellow'
        foo()
    }
    bar()   // color is not defined
```
当`foo`执行时，创建新的上下文并入栈，`this`指向`window`，词法环境无标识符，外部环境是全局环境。引擎在当前`词法环境/作用域`找不到`color`，沿着作用域链，外部环境是`foo`定义时的外部`全局环境/全局作用域`，而不是调用时的外部`bar的作用域`，对`bar的作用域`无访问权限，所以外部也找不到，就会报错。


# 词法环境（Lexical Environment）

词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符和具体变量和函数的关联。一个词法环境由环境记录器和一个可能的引用外部词法环境的空值组成。简单来说词法环境是一种持有`标识符—变量映射`的结构。这里的`标识符`指的是变量/函数的名字，而`变量`是对实际对象或原始数据的引用。  

## 词法环境的种类
词法环境有三种类型：
- **全局环境（Global Environment）**：是一个没有外部环境的词法环境，其外部环境引用为`null`。拥有一个全局对象（`window`对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，`this`的值指向这个全局对象。
- **函数环境（Function Environment）**：用户在函数中定义的变量被存储在环境记录中，包含了`arguments`对象。其外部环境可以是全局环境，也可以是包含内部函数的外部函数环境。  
- **模块环境（Module Environment）**：每个模块有自己的词法环境，存储了包括`imports`在内的所有的`top-level declarations`。其外部环境引用为全局环境。  

![avatar](/images/blog/environments/1.jpg)

## 词法环境的结构
![avatar](/images/blog/environments/data_structures.jpg)

词法环境由两部分组成：一个`Environment Record`，还有一个指向外层`Lexical Environment`的可空引用。
- **环境记录（Environment Record）：**An environment record maps identifiers to value. that maps variable names to variable values. This is where JavaScript stores variables. One key-value entry in the environment record is called a binding. 环境记录就是存储当前环境下的标识符-变量`key-value`的映射，存储变量、函数声明的实际位置。它分为三类：
  - **Declarative Environment Record：**store the effects of variable declarations, and function declarations.
  - **Object Environment Record：**are used by the with statement and for the global environment. They turn an object into an environment. For with, that is the argument of the statement. For the global environment, that is the global object.
  - **Global Environment Record**
- **对外部环境的引用：**A reference to the outer environment (null in the global environment) - the environment representing the outer scope of the scope represented by the current environment. 可以访问其外部词法环境。

其中`Declarative Environment Record`又可分为两类：`Function Environment Records`函数环境记录和`Module Environment Records`模块环境记录。
![avatar](/images/blog/environments/2.jpg)

## 词法环境的抽象
我们将词法环境（即作用域）抽象成伪代码，如下：
```
  GlobalExectionContext = {       // 全局执行上下文
    LexicalEnvironment: {    	  // 词法环境
      EnvironmentRecord: {        // 环境记录
        Type: "Object",      	  // 全局环境
        outer: <null>  	   		  // 对外部环境的引用
      }  
    }
  }

  FunctionExectionContext = {      // 函数执行上下文
    LexicalEnvironment: {  	       // 词法环境
      EnvironmentRecord: {  	   // 环境记录
        Type: "Declarative",  	   // 函数环境
        outer: <Global or outer function environment reference>  // 对外部环境的引用
      }  
    }
  }
```

# 变量环境（Variable Environment）
变量环境也是一个词法环境，`variable environment is a certain type of lexical environment`，因此它具有上面定义的词法环境的所有属性。  
`词法环境`和`变量环境`的区别在于前者用于存储`函数声明和变量（let const）`绑定，而后者仅用于存储`变量（var）`绑定。函数声明存储在`变量环境`中，而函数表达式存储在`词法环境`中。当遇到`with`和`catch`语句时，语句内部声明的变量是存储在外层词法环境中的，而外层的变量环境保持不变，当语句被销毁时，外层词法环境恢复。

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

# 附录

## 创建上下文时确定 this 的值（This Binding）
- 全局执行上下文中，this 的值指向全局对象。
- 函数执行上下文中，this 的值取决于函数的调用方式。具体有：默认绑定、隐式绑定、显式绑定、new 绑定、箭头函数。

## Record 和 Field
ES6 中将键值对的数据结构称为`Record`，其中的每一组键值对称为`field`。这就是说，一个 `Record`由多个`field`组成，而每个`field`都包含一对`key-value`。可以将`Record`看做一个对象`{}`。

## Identifier Binding
标识符绑定，将一个标识符和对应的值（数字、函数、对象等）绑定在一起。通俗说就是将值赋值给标识符。

## Identifier Resolver
标识符解析，指在运行的执行上下文中的词法环境里，通过标识符获得其对应绑定的过程。这一过程和原型链查找类似。通俗说就是获取标识符的值。