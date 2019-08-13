---
title: Javascript 隐式类型转换
comments: true
categories: javascript
tags: javascript
abbrlink: 45f33cfa
date: 2019-05-05 17:33:51
---
# 一、知识点
## 显式类型转换
```
  Number(mix)
  parseInt(string, radix)
  parseFloat(string)
  toString(radix)
  String(mix)
  Boolean()
  toFixed(radix)
```

## 隐式类型转换
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

## typeof
typeof 返回的六种数据类型：`number、string、boolean、object、undefined、function`
```
  typeof '1' // "string"
  typeof 2 // "number"
  typeof null // "object"
  typeof undefined // "undefined"
  typeof [] // "object"
  typeof Array // "function" 构造函数
  typeof NaN // "number"
```

## isNaN
isNaN() 会首先尝试将这个参数转换为数值，会隐式调用 Number()，然后才会对转换后的结果是否是 NaN 进行判断，如果是 NaN 则返回 true，否则返回 false。
```
  isNaN(1) // false
  isNaN('2') // false
  isNaN(null) // false, 因为Number(null)为0
  isNaN(undefined) // true, 因为Number(undefined)为NaN
  isNaN(NaN) // true
```

## 抽象比较算法
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/type-conversion_1.png)
在执行`抽象比较算法`的过程中，会发现会将 x、y 操作数进行隐式类型转化的，这也是 == 运算符副作用的体现。

## ToPrimitive
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/type-conversion_2.png)
toPrimitive 方法的目的就是将输入的参数转化成`非对象类型`。

## DefaultValue 处理过程：
![avatar](http://pw5hoox1r.bkt.clouddn.com/blog/type-conversion_3.png)
先解读一下这个算法：  
- 如果期望类型 hint 为字符串，那么，先调用被操作对象的 toString 方法，会在原型链中查找，如果找到且是一个可以调用的的方法的话，则将被操作对象作为 this 调用这个方法。否则如果得到值为原始值，则直接返回。如果没有得到原始值，则再调用 valueOf 方法，过程和 toString 一样，最终如果都不是原始值，则抛出异常。
- 如果期望类型为数字类型，则先调用 valueOf 后调用 toString。
- 如果没有明确知道期望类型的话，除非是 Data 类型默认为字符串。其他对象默认为数字处理，也就是说先调用 valueOf 方法后调用 toString 方法。

# 二、[] == false：
1. 根据`抽象比较算法`的 7、8、9、10 步骤。  
因为 [] 和 false 不是同一类型，所以执行到 8 的时候会调用 toNumber() 将 false 转化成 0。之后对`[] == 0`继续进行抽象比较算法，执行到 10 开始使用 toPrimitive() 对 [] 进行转化。  
2. 根据 DefaultValue 处理过程，对于`[] == 0` 中的 []，会沿着原型链找到 Array，但是 Array 没有实现 valueOf 方法，所以会沿着原型链最终调用 Object.prototype.valueOf()。但是 Object.prototype.valueOf() 返回的是一个对象，不是原始类型，所以还要调用 Array.prototype.toString() 方法。
3. 数组的 toString 相当于 join() 得到 ''。之后根据`抽象比较算法`中的 4、5，会调用 toNumber() 将空字符串 '' 转化成数字 ，最终变成`0 == 0`为 true。  

# 三、为什么 []==false 为 true，!![]==false 为 false
## 为什么 [] == false ？  
首先我们知道 [] 和 false 一个是对象，一个是布尔值，类型不同，需要类型转换再做比较。  
要注意，JS 中规定，如果 == 中有布尔值，只能转换为数字，因为如果布尔值转换成字符串那就是 true 和 false，那这种对比就毫无意义了。  
所以此问题可以转换成：为什么 [] == 0？  

## 为什么 [] == 0 ？  
我们知道 Primitive(原值) 和非 Primitive 比较，需要把非 Primitive 转换成 Primitive 才可以。[] 是一个对象，因此需要 toPrimitive()。而大部分对象最后都是用 toString() 来转换成 Primitive，少部分 valueOf() 转换。  
为什么是用 toString() 不是 toNumber() 之类的呢？ 因为每个对象都有 toString() 方法，Object.prototype.toString。  
我们来看看数组的 toString，数组的 toString 相当于 join()。  
所以此问题可以转换成：为什么`'' == 0`？

## 为什么 '' == 0 ？  
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
## 为什么 !![] == false 是 false 呢 ？
左边有 ! 会调用 Boolean() 进行隐式转换，可以看这个值是不是 Falsy(假值) 即可，只要不是Falsy，结果都是 true。Falsy 的值有 `0、''、false、NaN、null、undefined`。  
所以左边调用 Boolean() 得 true，右边为 false，所以`!![] == false`是 false。

## 为什么 null == 0 是 false 呢 ？  
null 和数字 0 本身已经是 Primitive 了，没有机会再走一遍 toPrimitive()，因此等号两边始终无法转换成同类型，只能返回 false。  

## 为什么 null == undefined 是 true 呢 ？  
JS 专门规定了 null == undefined 就是返回 true，属于一种特殊情况。  

# 四、一些例子
```
  [1] == '1'  // true
  '[object Object]' == {}  // true，({}).toString() === [object Object]
  ['0'] == false  // true
  0 || false  // false
  false || 0  // 0
  false || true  // true
  false || '1'  // '1'
```
