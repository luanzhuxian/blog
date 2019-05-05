---
title: Javascript 隐式类型转换
comments: true
categories: javascript
tags: javascript
abbrlink: 45f33cfa
date: 2019-05-05 17:33:51
---

# 显式类型转换
```
  Number(mix)
  parseInt(string, radix)
  parseFloat(string)
  toString(radix)
  String(mix)
  Boolean()
  toFixed(radix)
```

# 隐式类型转换
```
  isNaN
  ++/-- +/-
  +           // +'' === 0
  * /%
  && || !
  < > <= >=
  == !=
```
以上前五个会调用显式类型里面的 Number()，后两个会调用显式类型的 Boolean()。

# 为什么 [] == false ？  
首先我们知道 [] 和 false 一个是对象，一个是布尔值，类型不同，需要类型转换再做比较。  
要注意，JS 中规定，如果 == 中有布尔值，只能转换为数字，因为如果布尔值转换成字符串那就是 true 和 false，那这种对比就毫无意义了。  
所以此问题可以转换成：为什么 [] == 0？  

# 为什么 [] == 0 ？
我们知道 Primitive(原值) 和非 Primitive 比较，需要把非 Primitive 转换成 Primitive 才可以。[] 是一个对象，因此需要 toPrimitive()。而大部分对象最后都是用 toString() 来转换成 Primitive，少部分 valueOf()转换。  
为什么是用 toString 不是 toNumber 之类的呢？ 因为每个对象都有 toString 方法，Object.prototype.toString。  

我们来看看数组的 toString，数组的 toString 相当于 join()。  
所以此问题可以转换成：为什么'' == 0 ？

# 为什么'' == 0 ？  
而 JS 中规定，字符串和数字比较会把字符串转换成数字，用的 Number()。  
```
  Number('')  // 0
  Number('abc') // NaN
```
推理到此结束，我们回顾一下这个比较的转换规程：
```
  1. [] == false
  2. [] == 0
  3. '' == 0
  4. 0 == 0
```
# 为什么 !![] == true
直接判断这个值是不是 Falsy(假值) 即可，Falsy 的值有 `0、''、false、NaN、null、undefined`。只要不是这几个值，都是 true。  

# 为什么 null == 0 是 false 呢 ？  
null 和数字 0 本身已经是 Primitive 了，没有机会再走一遍 toPrimitive()，因此等号两边始终无法转换成同类型，只能返回 false。  

# 为什么 null == undefined 是 true 呢 ？  
JS 专门规定了 null == undefined 就是返回 true，属于一种特殊情况。  

# typeof
typeof 返回的六种数据类型：`number、string、boolean、object、undefined、function`
```
  typeof '1' // "string"
  typeof 'L' // "string"
  typeof 2 // "number"
  typeof null // "object"
  typeof undefined // "undefined"
  typeof [] // "object"
  typeof Array // "function" 构造函数
  typeof NaN // "number"
```

# isNaN
isNaN() 会首先尝试将这个参数转换为数值，会隐式调用 Number()，然后才会对转换后的结果是否是 NaN 进行判断，如果是 NaN 则返回 true，否则返回 false。
```
  isNaN(2) // false
  isNaN('2') // false
  isNaN(NaN) // true
  isNaN(null) // false, 因为Number(null)为0
  isNaN(undefined) // true, 因为Number(undefined)为NaN
```

# 一些例子
```
  [1] == '1'  // true
  '[object Object]' == {}  // true，({}).toString() === [object Object]
  ['0'] == false  // true
  0 || false  // false
  false || 0  // 0
  false || true  // true
  false || '1'  // '1'
```
