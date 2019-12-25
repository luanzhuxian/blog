---
title: ES6 的 Symbol
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
abbrlink: f44a9376
date: 2019-12-25 10:01:22
---

# 第七种数据类型
在 ES6 出现前，Javascript 有 6 种数据类型：
- Undefined
- Null
- Boolean
- Number
- String
- Object

每种类型都可以看做值的集合。前 5 种集合值的数量是有限的。比如 Boolean，只有`true`和`false`两种情况。Number 和 String 值的数量显然要多得多。根据 ECMA Standard，Number 大约有18,437,736,874,454,810,627 个值，String 的话大约有 (2144,115,188,075,855,872 − 1) ÷ 65,535 种可能。而对象的范围是无限的，每一个对象都是独一无二的。  

ES6 Symbol 是第七种数据类型。它有什么用处呢？  

# ES5 的问题
在 JavaScript 对象上存储数据是很容易的。  
比如说，我们想要写一个库通过 CSS transitions 让 DOM 元素随机游走，但是我们发现 CSS 效果没有生效，元素的运动轨迹不连贯。我们想跟踪哪些元素在运动，可以把元素给元素上加一个布尔类型属性 flag：
```
  if (element.isMoving) {
    smoothAnimations(element)
  }
  element.isMoving = true
```
但这样做会有潜在问题。
1. 其他的使用者如果用`for-in`或`Object.keys()`遍历该元素的话，会将`isMoving`遍历出来，带来混肴。
2. 如果其他人碰巧也在该元素上添加了`isMoving`同名的属性或方法，会产生冲突。

当然，你可以通过复杂的命名来解决第二个问题：
```
  if (element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__) {
    smoothAnimations(element)
  }
  element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__ = true
```
这显然不是一个好的办法。

那么我们可以通过加密包生成一个唯一的属性：
```
  const isMoving = Random.generateName();

  ...

  if (element[isMoving]) {
    smoothAnimations(element)
  }
  element[isMoving] = true
```
这样就可以避免冲突了。但是这样如何调试？每次加载的属性名都不同，debug的话也不方便。

# Symbol 的引入
Symbol 的出现解决了属性名冲突的问题。
```
const mySymbol = Symbol()
```
Symbol() 会生成一个第一无二的 Symbol 值。就像 Number 和 String 一样，Symbol 也可以被当作属性名，凡是属性名属于 Symbol 类型，就都是独一无二的，不会与其他属性名产生冲突。
```
  obj[mySymbol] = 'ok!'
  console.log(obj[mySymbol])  // ok!
```
对于上述问题，可以用 Symbol 来解决，不用加密也可以达到相同的效果:
```
  const isMoving = Symbol('isMoving')

  ...

  if (element[isMoving]) {
    smoothAnimations(element)
  }
  element[isMoving] = true
```
`element[isMoving]`是`symbol-keyed property`，不能通过点获取`obj.name`，只能通过方括号获取。  

因为 Symbol 的出现是为了避免冲突，所以它未被包含在对象自身的属性名集合`(property names)`之中。所以 JS 常规的对象检测方法会忽略 Symbol 属性名。比如`for-in`循环，会跳过 Symbol keys，`Object.keys(obj)、Object.getOwnPropertyNames(obj)、JSON.stringify()`也一样会忽略。所以，利用该特性，我们可以把一些不需要对外操作和访问的属性使用 Symbol 来定义。  

但是 Symbol 不是私有的，可用通过新的 API `Object.getOwnPropertySymbols(obj)`获取，该方法返回一个数组，包含对象所有的 Symbol keys。也可通过`Reflect.ownKeys(obj)`，返回包含 Symbol keys 在内的所有属性名。  

我们会发现在很多库和框架中用到了 Symbol，当然 JS 中本身在很多地方也用到了 Symbol。

# 什么是 Symbol ？
```
  const sym = Symbol('foo') // Symbol(foo)

  typeof sym // 'symbol'
```
通过 Symbol() 生成一个原始类型的值，不是对象。一经创建就不会被改变，不能在上面添加属性，是一种类似于字符串的数据类型。  

另一方面，每个 Symbol 都是独一无二的，任何两个 Symbol 都不一样，即使传的描述一样，这一点和对象很像。
```
  let s1 = Symbol()
  let s2 = Symbol()

  s1 === s2 // false

  let s1 = Symbol('foo')
  let s2 = Symbol('foo')

  s1 === s2 // false
```
读取描述需要将 Symbol 显式转为字符串，或者利用 ES2019 提供的`description`属性。
```
  const sym = Symbol('foo')

  String(sym) // Symbol(foo)
  sym.toString() // Symbol(foo)
  sym.description // 'foo'
```
需要注意的是，Symbol 不能被隐式转换为字符串，不能和其他数据类型计算。
```
  const sym = Symbol('3')

  "your symbol is " + sym
  // TypeError: can't convert symbol to string
  `your symbol is ${sym}`
  // TypeError: can't convert symbol to string
```

# 三种 Symbol
有三种获取 Symbol 的方法：
- **Symbol()**：就像上文所述，每次调用都会返回一个唯一的 Symbol 值。
- **Symbol.for(string)**：传入字符串作为描述，会在现有的全局 Symbol 集合中查找有没有以该描述作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。如果我们调用`Symbol.for('cat')`三次，则每次都会返回相同的 Symbol 值，不同于每次返回唯一值的 `Symbol()`，`Symbol.for()`使我们可以重复使用同一个 Symbol 值。
- **Symbol.iterator**：由规范定义，每种有不同的目的。

# ES6 中 Symbol 使如何使用的 ?
iterator 是一种设计模式，很多语言（比如java）通过 iterator 实现遍历功能，如果一个值支持遍历，那么它只需要实现 iterator 接口即可。  

在 JS 中也是一样，只是在 Symbol 出现之前这是一个隐藏的特性，我们只能通过 for 循环来实现数组遍历。

在 ES6 中的`for-of`遍历，就是通过隐藏的 iterator 来实现遍历的。其实是被遍历的对象已经部署了遍历器，遍历时其实是调用`array[Symbol.iterator]()`，返回该对象的默认遍历器。所以能被`for-of`遍历的数据类型像 Array、String、Map、Set 都部署了`Symbol.iterator`属性。  

而且现在我们可以通过 Symbol.iterator 来取到 iterator 对象，并且自己调用 iterator.next() 来实现遍历：
```
  const arr = [1, 2, 3]
  const iterator = arr[Symbol.iterator]()
  iterator.next() // {value: 1, done: false}
  iterator.next() // {value: 2, done: false}
  iterator.next() // {value: 3, done: false}
  iterator.next() // {value: undefined, done: true}
```
当然也可以通过`array.iterator()`来实现，但 Symbol 的使用避免了冲突保证了唯一性，可以更好的向后兼容。  

除此之外，还有几处 Symbol 的应用场景：
- **使 instanceof 更具扩展性**：在 ES6 中，`object instanceof constructor`被指定为构造方法`constructor[Symbol.hasInstance](object)`，使其更加灵活。
- **消除新旧特性的冲突**：是由动态作用域造成的，所以 ES6 引入了`Symbol.unscopables`，Web 标准可以用来将某些属性方法排除在动态作用域之外。
- **支持新的 string-matching**：在 ES5 中， `str.match(object)`会把`object`转换为`RegExp`。在 ES6 中，会先查看是否有`object[Symbol.match](str)`方法。  

总之，从长远角度来看，ECMA 标准会通过 Symbol 添加更多的新特性，并且不用担心冲突问题。在实际应用中，我们也可以用 Symbol 作为对象属性名，定义类的私有属性方法。
