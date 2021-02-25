---
title: JavaScript 中获取对象属性名集合的几种方式
comments: true
categories: javascript
tags: javascript
abbrlink: 8cc82479
date: 2021-02-25 20:49:15
---

直接看例子：
```
    const SymbolA = Symbol('A')
    const SymbolB = Symbol('B')

    function Person(name) {
        this.name = name
        this[SymbolA] = 'SymbolA'
    }

    Person.prototype = {
        constructor: Person,
        job: 'student',
        [SymbolB]: 'SymbolB'
    }

    var mimi = new Person('mimi')

    Object.defineProperty(mimi, 'sex', {
        value: 'female',
        enumerable: false   // 不可枚举
    })
```
下面我们分别用几种方法获取`mimi`的属性。  

# for...in

```
    const arr = []
    for (var key in mimi) {
        arr.push(key)
    }
    console.log('for...in', arr)    // ["name", "constructor", "job"]
```
`for...in` 会遍历 实例 + 原型 可枚举属性。可用`Object.hasOwnProperty`将原型上的属性`constructor`过滤掉。
```
    for (var key in mimi) {
        if (mimi.hasOwnProperty(key)) {
            arr.push(key)
        }
    }
```

# Object.keys
```
    console.log('Object.keys', Object.keys(mimi))   // ["name"]
```
`Object.keys`会遍历 实例 可枚举属性。  

# Object.getOwnPropertyNames
```
    console.log('Object.getOwnPropertyNames', Object.getOwnPropertyNames(mimi)) // ["name", "sex"]
```
`Object.getOwnPropertyNames`会遍历 实例 可枚举 + 不可枚举 属性。  

# Object.getOwnPropertySymbols
```
    console.log('Object.getOwnPropertySymbols', Object.getOwnPropertySymbols(mimi)) // [Symbol(A)]
```
`Object.getOwnPropertySymbols`会遍历实例上的`Symbol`属性。  

# Reflect.ownKeys
```
    console.log('Reflect.ownKeys', Reflect.ownKeys(mimi))   // ["name", "sex", Symbol(A)]
```
相当于`Object.getOwnPropertyNames` + `Object.getOwnPropertySymbols`。  



