---
title: ES6 的应用
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
abbrlink: b8aeaa25
date: 2019-05-07 12:52:11
---

# 对象解构
## 移除不想要的属性
```
  let {_internal, tooBig, ...cleanObject} = {el1: '1', _internal:"secret", tooBig:{}, el2: '2', el3: '3'} // 移除 _internal 和 tooBig 这两个属性
  cleanObject // {el1: '1', el2: '2', el3: '3'}
```

## 在函数参数中使用嵌套对象解构
在这个例子中 engine 是一个嵌套在 car 里面的对象，如果我们只需要 engine 里面的属性 vin 我们可以这样做。
```
  const car = {
    model: 'bmw 2018',
    engine: {
      v6: true,
      turbo: true,
      vin: 12345
    }
  }
  const modelAndVIN = ({model, engine: {vin}}) => {
    console.log(`model: ${model} vin: ${vin}`)
  }
  modelAndVIN(car) // model: bmw 2018  vin: 12345
```
## 合并对象
扩展运算符...
```
  let object1 = { a:1, b:2,c:3 }
  let object2 = { b:30, c:40, d:50}
  let merged = {…object1, …object2} //spread and re-add into merged
```

# 数组的解构
## 交换2个值
```
  const [post, comments] = Promise.all([
    fetch('/post'),
    fetch('/comments')
  ])
```

## 使用 Array 的方法
可以通过 (...) 扩展运算符将 Set 转换成 Array 这样我们就可以在 Set 使用所有 Array 的方法了。
```
  let mySet = newSet([1,2, 3, 4, 5])
  const filtered = [...mySet].filter((x) => x > 3) // [4, 5]
```

# Set
## 使用 set 来对数组去重
```
  let arr = [1, 1, 2, 2, 3, 3]
  let deduped = [...new Set(arr)] // [1, 2, 3]
```

# Map
## 使用对象初始化 Map 实例
```
  let obj = { a: 1, b: 1, c: 1 }
  map = new Map(Object.entries(obj))
  console.log(map.get('a')) // 1
  console.log(map.get('b'))
  console.log(map.get('c'))
```
