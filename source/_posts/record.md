---
title: 记录
comments: true
abbrlink: e797f254
date: 2019-05-05 17:15:03
categories:
tags:
---

# 用户从输入url到最终页面展示，这个过程都发生了什么？  
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

# 对象深拷贝
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

# Promise

### then 的返回值
`then`方法里接受两个函数作为参数，分别是`resolve`和`reject`后执行的回调，返回的是一个新的 Promise 实例。若回调有返回值，则将返回结果作为参数，传入下一个`then`的回调函数。若回调无返回值，仍将返回一个 Promise，但下一个`then`的回调函数的参数为`undefined`。也就是当链式调用时，不管有没有返回值，后面的`then`都会被执行。
```
 Promise.resolve()
  .then(res => console.log(1))
  .then(res => console.log(2))
  .then(res => console.log(3))
  // 打印结果 1, 2, 3
```

### catch
`Promise.prototype.catch`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。  

1. Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。
```
  getJSON('/post/1.json')
    .then(post => getJSON(post.commentURL))
    .then(comments => {
      // some code
    }).catch(error => {
      // 处理前面三个Promise产生的错误
    })
```
    上面代码中，一共有三个 Promise 对象：一个由`getJSON`产生，两个由`then`产生。它们之中任何一个抛出的错误，都会被最后一个`catch`捕获。  

2. `catch`方法返回的还是一个 Promise 对象，因此后面还可以接着调用`then`方法。
```
  const test = function() {
    return new Promise(function(resolve, reject) {
        throw new Error('test') // 或者 reject(new Error('test'))
    });
  };

  test()
    .catch(error => {
      console.log(error)
    })
    .then(res => {
      console.log('carry on')
    })
```
    上面代码运行完`catch`的回调函数，会接着运行后面的`then`的回调函数。如果没有报错，则会跳过`catch`方法。

### finally
`finally`本质上是`then`方法的特例。
```
  promise
  .finally(() => {
    // 语句
  })

  // 等同于
  promise
  .then(
    result => {
      // 语句
      return result
    },
    error => {
      // 语句
      throw error
    }
  )
```
上面代码中，如果不使用`finally`方法，同样的语句需要为成功和失败两种情况各写一次。有了`finally`方法，则只需要写一次。  

它的实现也很简单：
```
  Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
      value  => P.resolve(callback()).then(() => value),  // 传过来的 promise 是 fulfilled，则调用 resolve 回调
      reason => P.resolve(callback()).then(() => { throw reason })  // 传过来的 promise 是 rejected，则调用 reject 回调
    )
  }
```
上面代码中，不管前面的 Promise 是`fulfilled`还是`rejected`，都会执行回调函数`callback`。而且`finally`方法总是会返回原来的值。
```
  // resolve 的值是 undefined
  Promise.resolve(2).then(() => {}, () => {})

  // resolve 的值是 2
  Promise.resolve(2).finally(() => {})

  // reject 的值是 undefined
  Promise.reject(3).then(() => {}, () => {})

  // reject 的值是 3
  Promise.reject(3).finally(() => {})
```

# super
`super`这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。  

第一种情况，`super`作为函数调用时，代表父类的构造函数。
```
  class A {}

  class B extends A {
    constructor () {
      super()
    }
  }
```
`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是B的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。  

第二种情况，`super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。  

**在普通方法中：**  
`super`引用相当于指向对象原型的指针，相当于`Object.getPrototypeOf(this)`。
```
  class A {
    p () {
      return 2
    }
  }

  class B extends A {
    constructor () {
      super()
      console.log(super.p())
    }
  }

  let b = new B() // 2
```
上面代码中，`super`指向A.prototype，所以`super.p()`就相当于`A.prototype.p()`。  

这里需要注意，由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
```
  class A {
    constructor () {
      this.p = 2
    }
  }

  class B extends A {
    constructor () {
      super()
      console.log(super.p)
    }
    test () {
      return super.p
    }
  }

  let b = new B() // undefined
  b.test() // undefined
```
上面代码中，`p`是父类`A`实例的属性，`super.p`就引用不到它。如果属性定义在父类的原型对象上，`super`就可以取到：
```
  class A {
    constructor () {
      this.p = 2
    }
  }
  A.prototype.p = 3

  class B extends A {
    constructor () {
      super()
      console.log(super.p)
    }
    test () {
      return super.p
    }
  }

  let b = new B() // 3
  b.test() // 3
```

在子类普通方法中，通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。`super.doSth()`相当于`Object.getPrototypeOf(this).doSth.call(this)`。
```
class A {
  constructor () {
    this.x = 1
  }
  print () {
    console.log(this.x)
  }
}

class B extends A {
  constructor () {
    super()
    this.x = 2
  }
  print () {
    super.print()
  }
}

let b = new B()
b.print() // 2
```
`super.print()`虽然调用的是`A.prototype.print()`，但是`A.prototype.print()`内部的`this`指向子类`B`的实例，导致输出的是 2，而不是 1。也就是说，实际上执行的是`super.print.call(this)`。
```
  const myObject = {
    x: 'x',
    test () {
      return this.x
    }
  }

  const x = {
    __proto__: myObject,
    test () {
      return console.log(super.test() + 'x')
    }
  }

  x.test() // 'xx'
```
```
  const obj1 = {
    name: 'obj1',
    method1 () {
      console.log('method 1')
      console.log(this.name)
    }
  }

  const obj2 = {
    name: 'obj2',
    method2 () {
      super.method1()
    }
  }

  // 用 setPrototypeOf 将第二个对象的原型设为第一个对象
  Object.setPrototypeOf(obj2, obj1)
  obj2.method2() // 'method 1', 'obj2'
```
`super.method1()`相当于`obj1.method1.call(obj2)`。  

由于`this`指向子类实例，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性。
```
  class A {
    constructor () {
      this.x = 1
    }
  }

  class B extends A {
    constructor () {
      super()
      this.x = 2
      super.x = 3
      console.log(super.x)  // undefined
      console.log(this.x) // 3
    }
  }

  let b = new B()
```
`super.x`赋值为 3，这时等同于对`this.x`赋值为 3。而当读取`super.x`的时候，读的是`A.prototype.x`，所以返回`undefined`。  

**在静态方法中：**  
`super`将指向父类，而不是父类的原型对象。
```
  class Parent {
    constructor () {
      this.name = 1
    }
    static method () {
      console.log('static', this.name)
    }

    method () {
      console.log('instance', this.name)
    }
  }

  class Child extends Parent {
    constructor () {
      super()
      this.name = 2
    }
    static method () {
      super.method()
    }

    method () {
      super.method()
    }
  }

  var child = new Child()

  Child.method() // static Child
  child.method() // instance 2
```
