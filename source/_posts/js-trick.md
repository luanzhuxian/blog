---
title: 有用的 js 技巧
comments: true
categories: javascript
tags: javascript
abbrlink: a76aaff9
date: 2019-08-12 13:34:11
---

# 数组
## 合并数组
1. `Array.concat()`：会创建一个新的数组，对于大数组来说会消耗大量内存。
2. `Array.push.apply(arr1，arr2)`

## 类数组 arguments 对象、DOM 节点列表转化成数组的几种方式
1. for 循环后 rebuild
2. ES5 - `Array.prototype.slice.call(NodeList)` (性能差)
  ```
    // 以 arguments 为例
    (function fn(){
      var arr = Array.prototype.slice.call(arguments)
      return arr.reduce((prev, curr) => prev + curr, 0)
    })(1, 2, 3, 4) // 10
  ```
  可以使用如下方法
  ```
    function acc(...arr) {
      return arr.reduce((prev, curr) => prev + curr, 0)
    }
    function fn() {
      return acc.apply(null, arguments)
    }
    fn(1, 2, 3, 4) // 10
  ```
3. ES6 - 数组/对象扩展运算符`arr = [...NodeList]`
4. `Array.from()`
ES6 为了增加语义的清晰，语法的简洁性。添加了一个新方法`Array.from`，用于将 arrayLike 的对象转换成数组。  
`Array.from`方法用于将两类对象转为真正的数组：
  - 可遍历（iterable）的对象（包括 Set 和 Map）。
  - 类似数组的对象（array-like object）：所谓类似数组的对象，本质特征只有一点，即必须有 length 属性。因此，任何有 length 属性的对象，都可以通过 Array.from 方法转为数组。比如：
    - arguments 对象
    - DOM NodeList 对象
    - 包含 length 属性的普通对象 `{ a: 1, b: 2, length: 2 }`。

## Array and Boolean
数组中去除`falsy values(0, undefined, null, false, etc.)`
```
  array
    .map(item => {
        // ...
    })
    .filter(Boolean)    // Get rid of bad values
```

# 0、1互换
```
  let a = 0
  a = ~a + 2
  console.log(a) // 1
```

# 最大最小值
```
  // ES5
  var max = Math.max.apply(null, arr)
  var min = Math.min.apply(null, arr)

  // ES6
  var max = Math.max(...arr)
  var min = Math.min(...arr)
```

# 是否可迭代
```
  if ((typeof arr[Symbol.iterator]).toUpperCase() === 'FUNCTION') {
    // do something
  }
```

# 创建空对象
[Object.create()：创建对象的新方式](http://www.luanzhuxian.com/post/f92303d3.html)  

# Merge Objects
1. `Object.assgin()`
2. 扩展运算符
```
    const person = { name: 'David Walsh', gender: 'Male' }
    const tools = { computer: 'Mac', editor: 'Atom' }
    const attributes = { handsomeness: 'Extreme', hair: 'Brown', eyes: 'Blue' }
    const summary = { ...person, ...tools, ...attributes }
    /*
    Object {
        "computer": "Mac",
        "editor": "Atom",
        "eyes": "Blue",
        "gender": "Male",
        "hair": "Brown",
        "handsomeness": "Extreme",
        "name": "David Walsh",
    }
    */
```

# Require Function Parameters
函数的必选参数
```
    const isRequired = () => { throw new Error('param is required') }
    const hello = (name = isRequired()) => { console.log(`hello ${name}`) }

    hello() // This will throw an error because no name is provided
    hello(undefined)    // This will also throw an error
    hello(null)     // hello null
    hello('David')  // hello David
```

# Get Query String Parameters
获取 url 参数
```
    // Assuming "?post=1234&action=edit"
    let urlParams = new URLSearchParams(window.location.search)

    console.log(urlParams.has('post')) // true
    console.log(urlParams.get('action')) // "edit"
    console.log(urlParams.getAll('action')) // ["edit"]
    console.log(urlParams.toString()) // "?post=1234&action=edit"
    console.log(urlParams.append('active', '1')) // "?post=1234&action=edit&active=1"
```