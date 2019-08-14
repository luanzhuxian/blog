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
1. for 循环
2. `Array.prototype.slice.call(NodeList)`
3. `Array.from(NodeList)`
ES6 为了增加语义的清晰，语法的简洁性。添加了一个新方法`Array.from`，用于将 arrayLike 的对象转换成数组。
4. 数组/对象扩展运算符`arr = [...NodeList]`

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

# 数组去重
```
  const array = [...new Set([1, 2, 3, 3])]    // [1, 2, 3]
```

# Array and Boolean
数组中去除`falsy values(0, undefined, null, false, etc.)`
```
  array
    .map(item => {
        // ...
    })
    .filter(Boolean)    // Get rid of bad values
```

# 创建空对象
[Object.create()：创建对象的新方式](https://luanzhuxian.github.io/post/f92303d3.html)  

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