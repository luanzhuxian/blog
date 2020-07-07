---
title: Iterator 和 for-of
comments: true
categories: [javascript, es6]
tags: [javascript, es6]
abbrlink: 8aa98d9
date: 2019-04-29 17:20:20
---

# Iterator 接口
Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即`for...of`循环。当使用`for...of`循环遍历某种数据结构时，该循环会自动去寻找并调用`Symbol.iterator`方法。也就是说，一种数据结构只要部署了`Symbol.iterator`属性，就被视为具有 iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。  

`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回默认的遍历器。至于属性名`Symbol.iterator`，它是一个表达式，返回`Symbol`对象的 iterator 属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。  

下面是原生具备`Iterator`接口的数据结构：
- Array
- Map
- Set
- String
- TypedArray
- 类数组的对象（比如 arguments 对象、DOM NodeList 对象）
- Generator 对象

# 原型链上的对象具有该方法也可
- 解构赋值
- 扩展运算符
- yield*
- for...of
- Array.from()
- Map(), Set()
- Promise.all()
- Promise.race()

# 遍历数组
数组原生具备 iterator 接口。
```
  const arr = ['a', 'b', 'c', 'd']

  for (let v in arr) {
    console.log(v)
  }
  // 0 1 2 3

  for (let v of arr) {
    console.log(v)
  }
  // a b c d

  for (let k of arr.keys()) {
    console.log(k)
  }
  // 0 1 2 3

  for (let value of arr.values()) {
    console.log(value)
  }
  // a b c d

  for (let [index, value] of arr.entries()) {
    console.log(key, '->', value)
  }
  // 0 -> a
  // 1 -> b
  // 2 -> c
  // 3 -> d
```

# 遍历类数组
```
  // 字符串
  let str = 'hello'

  for (let s of str) {
    console.log(s)
  }
  // h e l l o

  // DOM NodeList对象
  let paras = document.querySelectorAll('p')

  for (let p of paras) {
    p.classList.add('test')
  }

  // arguments 对象
  function printArgs () {
    for (let x of arguments) {
      console.log(x)
    }
  }
  printArgs('a', 'b')
  // 'a'
  // 'b'
```

并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用`Array.from`方法将其转为数组。
```
  const arrayLike = { length: 2, 0: 'a', 1: 'b' }

  for (let x of arrayLike) {
    console.log(x)
  }
  // 报错：arrayLike is not iterable

  // ES5的写法
  const array = [].slice.call(arrayLike)

  // ES6的写法
  const array = Array.from(arrayLike)

  for (let x of array) {
    console.log(x)
  }
  // a
  // b
```

# 遍历对象
对于普通的对象，`for...of`结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。那么怎么做到使对象可遍历？


## 方法一：部署 Iterator 接口（在 Symbol.iterator 的属性上部署遍历器生成方法）
一个对象如果要具备可被`for...of`循环调用的 Iterator 接口，就必须在`Symbol.iterator`的属性上部署遍历器生成方法。  

1、添加 next 方法：
```
  const obj = {
    [Symbol.iterator] () {
      let value = 0
      let stop = 3
      return {
        next () {
          while (value < stop) {
            value++
            return {
              done: false,
              value
            }
          }
          return {
            done: true,
            value: undefined
          }
        }
      }
    }
  }

  const i = obj[Symbol.iterator]()
  i.next()  // { value: 1, done: false }
  i.next()  // { value: 2, done: false }
  i.next()  // { value: 3, done: false }
  i.next()  // { value: 3, done: true }

  // 或
  for (const v of obj) {
    console.log(v)
  }
  // 1
  // 2
  // 3
```
```
  const arr = ['red', 'green', 'blue']
  const obj = {}

  obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr)

  for (let v of obj) {
    console.log(v)
  }
  // red green blue
```

原型链上的对象具有该方法也可以。
```
  class RangeIterator {
    constructor (start, stop) {
      this.value = start
      this.stop = stop
    }

    [Symbol.iterator] () {
      return this
    }

    next () {
      var value = this.value
      if (value < this.stop) {
        this.value++
        return {
          done: false,
          value: value
        }
      }
      return {
        done: true,
        value: undefined
      }
    }
  }

  function range (start, stop) {
    return new RangeIterator(start, stop)
  }

  for (const v of range(0, 3)) {
    console.log(v)
  }
  // 0
  // 1
  // 2
```

2、Generator：
```
  class Collection {
    *[Symbol.iterator] () {
      let i = 0
      while (this[i] !== undefined) {
        yield this[i]
        ++i
      }
    }
  }

  const collection = new Collection()
  collection[0] = 1
  collection[1] = 2
  
  for (const v of collection) {
    console.log(v)
  }
  // 1
  // 2
```
由于`Generator`函数就是遍历器生成函数，因此可以把`Generator`赋值给对象的`Symbol.iterator`属性，从而使得该对象具有`Iterator`接口。
```
  var myIterable = {}
  myIterable[Symbol.iterator] = function* () {
    yield 1
    yield 2
    yield 3
  }
  [...myIterable] // [1, 2, 3]
```

## 方法二：使用 Object.keys()、Object.values()、Object.entries()
```
  const obj = { a: 1, b: 2, c: 3 }

  for (const key of Object.keys(obj)) {
    console.log(key, '->', obj[key])
  }
  // a -> 1
  // b -> 2
  // c -> 3

  for (const value of Object.values(obj)) {
   console.log(value)
  }
  // 1
  // 2
  // 3

  for (const [key, value] of Object.entries(obj)) {
    console.log(key, '->', value)
  }
  // a -> 1
  // b -> 2
  // c -> 3
```

## 方法三：使用 Object.getOwnPropertyNames()
包含不可枚举属性，不包含`Symbol`属性。
```
  for (const key of Object.getOwnPropertyNames(obj)) {
   console.log(key + ': ' + obj [key])
  }
  // a -> 1
  // b -> 2
  // c -> 3
```

## 方法四：使用 Reflect.ownKeys()
包含不可枚举属性，也包含`Symbol`属性。基本等同于`Object.getOwnPropertyNames`与`Object.getOwnPropertySymbols`之和。
```
  for (const key of Reflect.ownKeys(obj)) {
   console.log(key + ': ' + obj [key])
  }
  // a -> 1
  // b -> 2
  // c -> 3
```

## 方法五：使用 Generator 函数将对象重新包装
```
  function* entries(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]]
    }
  }

  for (let [key, value] of entries(obj)) {
    console.log(key, '->', value)
  }
  // a -> 1
  // b -> 2
  // c -> 3
```

## 方法六：使用 Map 代替对象
```
  const map = new Map(Object.entries(obj))

  for (const [key, value] of map) {
    console.log(key, '->', value)
  }
  // a -> 1
  // b -> 2
  // c -> 3
```